require 'fileutils'
require 'yaml'
require 'diffy'
require 'git'

class NoKindError < Exception; end

module ForemanTemplates
  class TemplateImporter
    delegate :logger, :to => :Rails
    attr_accessor :metadata, :name, :text

    def initialize(args = {})
      @verbose   = args[:verbose] || false
      @associate = args[:associate] || 'new'
      @prefix    = args[:prefix] || 'Community '
      @dirname   = args[:dirname] || '/'
      @filter    = args[:filter] || nil
      @repo      = args[:repo] || 'https://github.com/theforeman/community-templates.git'
      @branch    = args[:branch] || false

      # Rake hands off strings, not booleans, and "false" is true...
      if @verbose.is_a?(String)
        @verbose = if @verbose == 'false'
                     false
                   else
                     true
                   end
      end
    end

    def import!
      # Check out the community templates to a temp location
      @dir = Dir.mktmpdir

      begin
        gitrepo = Git.clone(@repo, @dir)
        branch = @branch ? @branch : get_default_branch(gitrepo)
        gitrepo.checkout(branch) if branch

        parse_files!
      ensure
        FileUtils.remove_entry_secure(@dir) if File.exist?(@dir)
      end
    end

    def parse_files!
      # Build a list of ERB files to parse
      Dir["#{@dir}#{@dirname}/**/*.erb"].each do |template|
        text = File.read(template)
        puts 'Parsing: ' + template.gsub(/#{@dir}#{@dirname}/, '') if @verbose

        metadata = parse_metadata(text)
        metadata['associate'] = @associate

        # Get the name and filter
        filename = template.split('/').last
        title    = filename.split('.').first
        name     = metadata['name'] || title
        name     = [@prefix, name].compact.join
        next if @filter && !name.match(/#{@filter}/i)

        unless metadata['kind']
          puts '  Error: Must specify template kind'
          next
        end

        begin
          # Expects a return of { :diff, :status, :result }
          data = if metadata['model'].present?
                   metadata['model'].constantize.import!(name, text, metadata)
                 else
                   # For backwards-compat before "model" metadata was added
                   case metadata['kind']
                   when 'ptable'
                     Ptable.import!(name, text, metadata)
                   when 'job_template'
                     # TODO: update REX templates to have `model` and delete this
                     update_job_template(name, text)
                   else
                     ProvisioningTemplate.import!(name, text, metadata)
                   end
                 end

          if data[:status] == true && @verbose
            puts data[:result]
            puts data[:diff]
          elsif data[:status] == false
            puts "Template \"#{name}\": #{data[:result]}"
          end
        rescue NoKindError
          puts "  Error: Unknown template type '#{metadata['kind']}'"
          next
        end
      end
    end

    def get_default_branch(repo)
      branch_names = repo.branches.map(&:name).uniq

      # Always use develop on Foreman-nightly, if present, or else relevant stable branch
      target = SETTINGS[:version].tag == 'develop' ? 'develop' : "#{SETTINGS[:version].short}-stable"
      return target if branch_names.include?(target)

      # stay on default branch as fallback
      nil
    end

    def parse_metadata(text)
      # Pull out the first erb comment only - /m is for a multiline regex
      extracted = text.match(/<%\#(.+?).-?%>/m)
      extracted.nil? ? {} : YAML.load(extracted[1])
    end

    def update_job_template(name, text)
      return {
        :status => false,
        :result => 'Skipping job template import, remote execution plugin is not installed.'
      } unless defined?(JobTemplate)
      template = JobTemplate.import(
        text.sub(/^name: .*$/, "name: #{name}"),
        :update => true
      )

      c_or_u = template.new_record? ? 'Created' : 'Updated'
      id_string = ('id' + template.id) rescue ''

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
  end
end
