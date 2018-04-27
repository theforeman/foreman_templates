module ForemanTemplates
  class TemplateImporter < Action
    attr_accessor :metadata, :name, :text

    def self.setting_overrides
      super + %i(associate force lock)
    end

    def initialize(args = {})
      super
      @verbose = parse_bool(@verbose)
      @force = parse_bool(@force)
      @lock = parse_bool(@lock)
    end

    def import!
      if git_repo?
        import_from_git
      else
        import_from_files
      end
    end

    def import_from_files
      @dir = get_absolute_repo_path
      verify_path!(@dir)
      return parse_files!
    end

    def import_from_git
      # Check out the community templates to a temp location
      @dir = Dir.mktmpdir

      begin
        gitrepo = Git.clone(@repo, @dir)
        branch = @branch ? @branch : get_default_branch(gitrepo)
        gitrepo.checkout(branch) if branch

        return parse_files!
      ensure
        FileUtils.remove_entry_secure(@dir) if File.exist?(@dir)
      end
    end

    def parse_files!
      result_lines = []

      # Build a list of ERB files to parse
      Dir["#{@dir}#{@dirname}/**/*.erb"].each do |template|
        text = File.read(template)
        result_lines << 'Parsing: ' + template.gsub(/#{@dir}#{@dirname}/, '') if @verbose

        metadata = Template.parse_metadata(text)

        # Get the name and filter
        name = metadata['name']
        name = auto_prefix(name)
        if @filter
          matching = name.match(/#{@filter}/i)
          matching = !matching if @negate
          unless matching
            result_lines << "Skipping template '#{name}' since it's name is matching filter condition" if @verbose
            next
          end
        end

        template_type = 'Unknown template type'
        begin
          if metadata.key?('model')
            template_type = metadata['model'].constantize
          else
            result_lines << "Metadata for template '#{name}' do not specify 'model', import failed"
            next
          end

          template = template_type.import_without_save(name, text, import_options)

          data = {}
          if template.template_changed?
            data[:old] = template.template_was
            data[:new] = template.template
            if data[:diff].nil? && data[:old].present? && data[:new].present?
              data[:diff] = calculate_diff(data[:old], data[:new])
            end
          end

          if @force
            template.ignore_locking { template.save! }
          else
            template.save!
          end

          template_type = template.class.model_name.human
          data[:status] = template.errors.blank? ? "#{template_type} '#{name}' import successful" : "#{template_type} '#{name}' import failed"
          data[:errors] = template.errors.full_messages

          if @verbose
            result_lines << data[:diff] unless data[:diff].nil?
          end
          result_lines << data[:status]
          result_lines << data[:errors] unless data[:errors].empty?
        rescue => e
          Foreman::Logging.exception 'error during template import', e, :level => :debug
          result_lines << "#{template_type} '#{name}' import failed - #{e.message}"
          next
        end
      end
      result_lines
    end

    def import_options
      { :force => @force,
        :associate => @associate,
        :lock => @lock,
        :organization_params => @organizations,
        :location_params => @locations }
    end

    def auto_prefix(name)
      name.start_with?(@prefix) ? name : [@prefix, name].compact.join
    end

    def calculate_diff(old, new)
      if old != new
        Diffy::Diff.new(old, new, :include_diff_info => true).to_s(:color)
      else
        nil
      end
    end

    def purge!
      clause = "name #{@negate ? 'NOT ' : ''}LIKE ?"
      ProvisioningTemplate.where(clause, "#{@prefix}%").each do |template|
        puts template if @verbose
        template.destroy
      end
      # :purge
    end

    private

    def parse_bool(bool_name)
      bool_name.is_a?(String) ? bool_name != 'false' : bool_name
    end
  end
end
