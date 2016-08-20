require 'fileutils'
require 'yaml'
require 'diffy'
require 'git'

class NoKindError < Exception ; end

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
      if @verbose.kind_of?(String)
        if @verbose == 'false'
          @verbose = false
        else
          @verbose = true
        end
      end

      # TODO - these are properties of each template
      # they should probably have their own model/tests
      # for now, we reset them at the start of each import
      @metadata = {}
      @name = ''
      @text = ''
    end

    def import!
      # Check out the community templates to a temp location
      dir = Dir.mktmpdir
      begin
        gitrepo = Git.clone(@repo, dir)
        branch = @branch ? @branch : get_default_branch(gitrepo)
        gitrepo.checkout(branch) if branch

        # Build a list of ERB files to parse
        Dir["#{dir}#{@dirname}/**/*.erb"].each do |template|
          @text = File.read(template)
          puts "Parsing: " + template.gsub(/#{dir}#{@dirname}/,'') if @verbose

          @metadata = parse_metadata(@text)

          # Get the name and filter
          filename = template.split('/').last
          title    = filename.split('.').first
          @name    = @metadata['name'] || title
          @name    = [@prefix, @name].compact.join()
          next if @filter and not @name.match(/#{filter}/i)

          unless @metadata['kind']
            puts "  Error: Must specify template kind"
            next
          end

          begin
            case @metadata['kind']
            when 'ptable'
              data = update_ptable
            when 'snippet'
              data = update_snippet
            when 'job_template'
              data = update_job_template
            else
              data = update_template
            end

            if data[:status] == true && @verbose
              puts data[:result]
              puts data[:diff]
            elsif data[:status] == false
              puts "Error with #{@name}"
              puts data[:result]
            end
          rescue NoKindError
            puts "  Error: Unknown template type '#{@metadata['kind']}'"
            next
          end
        end
      ensure
        FileUtils.remove_entry_secure(dir) if File.exist?(dir)
      end
    end

    def get_default_branch(repo)
      branch_names = repo.branches.map(&:name).uniq

      # Always use develop on Foreman-nightly, if present, or else relevant stable branch
      target = SETTINGS[:version].tag == 'develop' ? 'develop' : "#{SETTINGS[:version].short}-stable"
      return target if branch_names.include?(target)

      # stay on default branch as fallback
      return nil
    end

    def map_oses
      oses = if @metadata['oses']
               @metadata['oses'].map do |os|
                 Operatingsystem.all.map { |db| db.to_label =~ /^#{os}/ ? db : nil}
               end.flatten.compact
             else
               []
             end
      return oses
    end

    def parse_metadata(text)
      # Pull out the first erb comment only - /m is for a multiline regex
      extracted = text.match(/<%\#(.+?).-?%>/m)
      extracted == nil ? {} : YAML.load(extracted[1])
    end

    def update_template
      # Get template type
      unless kind = TemplateKind.find_by_name(@metadata['kind'])
        raise NoKindError
      end

      db_template = ProvisioningTemplate.where(:name => @name).first_or_initialize
      data = {
        :template         => @text,
        :snippet          => false,
        :template_kind_id => kind.id
      }
      string = db_template.new_record? ? "Created" : "Updated"

      oses = map_oses
      if (@associate == 'new' and db_template.new_record?) or (@associate == 'always')
        data[:operatingsystem_ids] = oses.map(&:id)
      end

      if @text != db_template.template
        diff    = Diffy::Diff.new(db_template.template, @text, :include_diff_info => true).to_s(:color)
        status  = db_template.update_attributes(data)
        result  = "  #{string} Template #{ 'id' + db_template.id rescue ''}:#{@name}"
        result += "\n    Operatingsystem Associations:\n    - #{oses.map(&:fullname).join("\n    - ")}" if !oses.empty?
      elsif data[:operatingsystem_ids]
        diff    = nil
        status  = db_template.update_attributes(data)
        result  = "  #{string} Template Associations #{ 'id' + db_template.id rescue ''}:#{@name}"
        result += "\n    Operatingsystem Associations:\n    - #{oses.map(&:fullname).join("\n    - ")}" if !oses.empty?
      else
        diff    = nil
        status  = true
        result  = "  No change to Template #{ ( 'id' + db_template.id ) rescue ''}:#{@name}"
      end
      { :diff => diff, :status => status, :result => result }
    end

    def update_job_template
      return {:status => false, :result => 'Skipping job template import, remote execution plugin is not installed.'} unless defined?(JobTemplate)
      template = JobTemplate.import(@text.sub(/^name: .*$/, "name: #{@name}"), :update => true)

      string = template.new_record? ? 'Created' : 'Updated'

      if template.template != template.template_was
        diff = Diffy::Diff.new(template.template_was, template.template, :include_diff_info => true).to_s(:color)
      end

      result = "  #{string} Template #{ 'id' + template.id rescue ''}:#{@name}"

      {:diff => diff, :status => template.save, :result => result}
    end

    def update_ptable
      db_ptable = Ptable.where(:name => @name).first_or_initialize
      data = { :layout => @text }
      string = db_ptable.new_record? ? "Created" : "Updated"

      oses = map_oses
      if (@associate == 'new' and db_ptable.new_record?) or (@associate == 'always')
        data[:os_family] = oses.map(&:family).uniq.first
      end

      if @text != db_ptable.layout
        diff    = Diffy::Diff.new(db_ptable.layout, @text, :include_diff_info => true).to_s(:color)
        status  = db_ptable.update_attributes(data)
        result  = "  #{string} Ptable #{ ( 'id' + db_ptable.id ) rescue ''}:#{@name}"
      elsif data[:os_family]
        diff    = nil
        status  = db_ptable.update_attributes(data)
        result  = "  #{string} Ptable Associations #{ ( 'id' + db_ptable.id ) rescue ''}:#{@name}"
        result += "\n    Operatingsystem Family:\n    - #{oses.map(&:family).uniq.first}" if !oses.empty?
      else
        diff    = nil
        status  = true
        result  = "  No change to Ptable #{ ( 'id' + db_ptable.id ) rescue ''}:#{@name}"
      end
      { :diff => diff, :status => status, :result => result }
    end

    def update_snippet
      db_snippet = ProvisioningTemplate.where(:name => @name).first_or_initialize
      data = {
        :template => @text,
        :snippet => true
      }
      string = db_snippet.new_record? ? "Created" : "Updated"

      if @text != db_snippet.template
        diff    = Diffy::Diff.new(db_snippet.template, @text, :include_diff_info => true).to_s(:color)
        status  = db_snippet.update_attributes(data)
        result  = "  #{string} Snippet #{ ('id' + db_snippet.id) rescue ''}:#{@name}"
      else
        diff    = nil
        status  = true
        result  = "  No change to Snippet #{ 'id' + db_snippet.id rescue ''}:#{@name}"
      end
      { :diff => diff, :status => status, :result => result }
    end

  end
end
