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
      @result_lines = []
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
      parse_files!
    end

    def import_from_git
      # Check out the community templates to a temp location
      @dir = Dir.mktmpdir

      begin
        logger.debug "cloned '#{@repo}' to '#{@dir}'"
        gitrepo = Git.clone(@repo, @dir)
        if @branch
          logger.debug "checking out branch '#{@branch}'"
          gitrepo.checkout(@branch)
        end

        parse_files!
      ensure
        FileUtils.remove_entry_secure(@dir) if File.exist?(@dir)
      end
    end

    def parse_files!
      Dir["#{@dir}/#{@dirname}/**/*.erb"].each do |template_file|
        logger.debug 'Parsing: ' + template_file.gsub(%r{#{@dir}\/#{@dirname}}, '')
        parse_result = ParseResult.new(template_file)

        text = File.read(template_file)
        metadata = Template.parse_metadata(text)

        next if metadata_corrupted?(metadata, parse_result)

        next unless (name = auto_prefix_name(metadata, parse_result))

        next if filtered_out name, parse_result

        begin
          next unless (template_type = template_model(metadata, parse_result))
          template = template_type.import_without_save(name, text, import_options)
          parse_result.template = template
          parse_result.determine_result_diff

          save_template template, @force
          @result_lines << parse_result.check_for_errors
        rescue NameError => e
          @result_lines << parse_result.name_error(e, metadata['model'])
        rescue => e
          @result_lines << parse_result.add_exception(e)
        end
      end
      { :results => @result_lines, :repo => @repo, :branch => @branch }
    end

    def import_options
      { :force => @force,
        :associate => @associate,
        :lock => @lock,
        :organization_params => @taxonomies[:organizations],
        :location_params => @taxonomies[:locations] }
    end

    def template_model(metadata, parse_result)
      if metadata.key?('model')
        metadata['model'].constantize
      else
        @result_lines << parse_result.missing_model
        nil
      end
    end

    def save_template(template, force)
      result = nil
      if force
        result = template.ignore_locking { template.save }
      else
        result = template.save
      end

      if result
        logger.debug 'saved'
      else
        logger.error "couldn't save the template because of: #{template.errors.full_messages.join(', ')}"
      end
      result
    end

    def filtered_out(name, parse_result)
      if @filter && !name_matching_filter?(name)
        @result_lines << parse_result.matching_filter
        true
      end
    end

    def metadata_corrupted?(metadata, parse_result)
      if metadata.empty?
        @result_lines << parse_result.corrupted_metadata
        return true
      end
      false
    end

    def name_matching_filter?(name)
      matching = name.match(/#{@filter}/i)
      return !matching if @negate
      matching
    end

    def auto_prefix_name(metadata, parse_result)
      unless (name = metadata['name'])
        @result_lines << parse_result.no_metadata_name
        return nil
      end
      parse_result.name = auto_prefix(name)
      auto_prefix(name)
    end

    def auto_prefix(name)
      name.start_with?(@prefix) ? name : [@prefix, name].compact.join
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
