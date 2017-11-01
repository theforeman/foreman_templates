class NoKindError < RuntimeError; end
class MissingKindError < RuntimeError; end

module ForemanTemplates
  class TemplateImporter < Action
    attr_accessor :metadata, :name, :text

    def self.setting_overrides
      super + %i(associate force)
    end

    def initialize(args = {})
      super
      @verbose = parse_bool(@verbose)
      @force = parse_bool(@force)
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

        metadata = parse_metadata(text)
        metadata['associate'] = @associate

        # Get the name and filter
        filename = template.split('/').last
        title    = filename.split('.').first
        name     = metadata['name'] || title
        name     = auto_prefix(name)
        if @filter
          matching = name.match(/#{@filter}/i)
          matching = !matching if @negate
          next unless matching
        end

        begin
          # Expects a return of { :diff, :status, :result, :errors }
          data = if metadata['model'].present?
                   metadata['model'].constantize.import!(name, text, metadata, @force)
                 else
                   # For backwards-compat before "model" metadata was added
                   case metadata['kind']
                   when 'ptable'
                     Ptable.import!(name, text, metadata, @force)
                   when 'job_template'
                     # TODO: update REX templates to have `model` and delete this
                     update_job_template(name, text)
                   else
                     ProvisioningTemplate.import!(name, text, metadata, @force)
                   end
                 end

          if data[:diff].nil? && data[:old].present? && data[:new].present?
            data[:diff] = calculate_diff(data[:old], data[:new])
          end

          if @verbose
            result_lines << data[:result]
            result_lines << data[:diff] unless data[:diff].nil?
          end
          result_lines << status_to_text(data[:status], name)
          result_lines << data[:errors] unless data[:errors].empty?
        rescue MissingKindError
          result_lines << "  Skipping: '#{name}' - No template kind or model detected"
          next
        rescue NoKindError
          result_lines << "  Skipping: '#{name}' - Unknown template kind '#{metadata['kind']}'"
          next
        rescue NameError
          result_lines << "  Skipping: '#{name}' - Unknown template model '#{metadata['model']}'"
          next
        end
      end
      result_lines
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

    def parse_metadata(text)
      # Pull out the first erb comment only - /m is for a multiline regex
      extracted = text.match(/<%\#[\t a-z0-9=:]*(.+?).-?%>/m)
      extracted.nil? ? {} : YAML.load(extracted[1])
    end

    def update_job_template(name, text)
      file = name.gsub(/^#{@prefix}/, '')
      puts 'Deprecation warning: JobTemplate support is moving to the Remote Execution plugin'
      puts "- please add 'model: JobTemplate' to the metadata in '#{file}' to call the right method"

      unless defined?(JobTemplate)
        return {
          :status => false,
          :result => 'Skipping job template import, remote execution plugin is not installed.'
        }
      end
      template = JobTemplate.import(
        text.sub(/^name: .*$/, "name: #{name}"),
        :update => true
      )

      c_or_u = template.new_record? ? 'Created' : 'Updated'
      begin
        id_string = ('id' + template.id)
      rescue StandardException
        id_string = ''
      end

      if template.template != template.template_was
        diff = Diffy::Diff.new(
          template.template_was,
          template.template,
          :include_diff_info => true
        ).to_s(:color)
      end

      result = "  #{c_or_u} Template #{id_string}:#{name}"
      { :diff => diff, :status => template.save, :result => result }
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

    def status_to_text(status, name)
      msg = "#{name} - import "
      msg << if status
               "success"
             else
               'failure'
             end
      msg
    end
  end
end
