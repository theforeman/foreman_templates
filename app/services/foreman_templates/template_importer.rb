class TemplateImportError < RuntimeError; end

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
      parse_results = []
      template_parser = TemplateParser.new(:force => @force)
      # Build a list of ERB files to parse
      Dir["#{@dir}#{@dirname}/**/*.erb"].each do |template|
        text = File.read(template)

        parse_result = ParseResult.new
        parse_result.add 'Parsing: ' + template.gsub(/#{@dir}#{@dirname}/, ''), true

        metadata = process_metadata(text)

        name = parse_name template, metadata['name']

        next if @filter && !name_matching_filter?(name)

        begin
          parse_result = template_parser.parse_template_file(parse_result, name, text, metadata)
        rescue TemplateImportError => e
          parse_result.add_import_error e
          parse_results << parse_result
        end
      end
      parse_results.map { |result| result.to_s(@verbose)}
    end

    def auto_prefix(name)
      name.start_with?(@prefix) ? name : [@prefix, name].compact.join
    end

    def name_matching_filter?(name)
      matching = name.match(/#{@filter}/i)
      !matching if @negate
    end

    def parse_metadata(text)
      # Pull out the first erb comment only - /m is for a multiline regex
      extracted = text.match(/<%\#[\t a-z0-9=:]*(.+?).-?%>/m)
      extracted.nil? ? {} : YAML.load(extracted[1])
    end

    def process_metadata(text)
      metadata = parse_metadata(text)
      metadata['associate'] = @associate
      metadata
    end

    def parse_name(template_file, from_metadata)
      filename = template_file.split('/').last
      title    = filename.split('.').first
      name     = from_metadata || title
      auto_prefix(name)
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
