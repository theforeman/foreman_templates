require 'fileutils'
require 'yaml'
require 'diffy'
require 'git'

class NoKindError < Exception ; end

def db_oses
  @db_oses || Operatingsystem.all
end

def metadata(text)
  # Pull out the first erb comment only - /m is for a multiline regex
  extracted = text.match(/<%\#(.+?).-?%>/m)
  extracted == nil ? {} : YAML.load(extracted[1])
end

def map_oses
  oses = if @metadata['oses']
           @metadata['oses'].map do |os|
             db_oses.map { |db| db.to_label =~ /^#{os}/ ? db : nil}
           end.flatten.compact
         else
           []
         end
  return oses
end

def update_template
  # Get template type
  unless kind = TemplateKind.find_by_name(@metadata['kind'])
    raise NoKindError
  end

  db_template = ProvisioningTemplate.find_or_initialize_by_name(@name)
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

def update_ptable
  db_ptable = Ptable.find_or_initialize_by_name(@name)
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
  db_snippet = ProvisioningTemplate.find_or_initialize_by_name(@name)
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

def get_default_branch(repo)
  branch_names = repo.branches.map(&:name).uniq

  # Always use develop on Foreman-nightly, if present, or else relevant stable branch
  target = SETTINGS[:version].tag == 'develop' ? 'develop' : "#{SETTINGS[:version].short}-stable"
  return target if branch_names.include?(target)

  # stay on default branch as fallback
  return nil
end

desc <<-END_DESC
Synchronize templates from a git repo
END_DESC
namespace :templates do
  task :sync => :environment do
    # Available options:
    #* verbose   => Print extra information during the run [false]
    #* repo      => Sync templates from a different Git repo [https://github.com/theforeman/community-templates]
    #* branch    => Branch in Git repo [default branch]
    #* prefix    => The string all imported templates should begin with [Community ]
    #* dirname   => The directory within the git tree containing the templates [/]
    #* filter    => Import names matching this regex (case-insensitive; snippets are not filtered)
    #* associate => Associate to OS, always, new or never  [new]

    @verbose   = ( ENV['verbose'] and ENV['verbose'] != 'false' ) ? true : false
    @associate = ENV['associate'] ? ENV['associate'] : 'new'
    prefix     = ENV['prefix'] ? ENV['prefix'] : 'Community '
    dirname    = ENV['dirname'] ? ENV['dirname'] : '/'
    filter     = ENV['filter'] ? ENV['filter'] : nil
    repo       = ENV['repo'] ? ENV['repo'] : "https://github.com/theforeman/community-templates.git"

    # Check out the community templates to a temp location
    dir = Dir.mktmpdir
    begin
      gitrepo = Git.clone(repo, dir)
      branch = ENV['branch'] ? ENV['branch'] : get_default_branch(gitrepo)
      gitrepo.checkout(branch) if branch

      # Build a list of ERB files to parse
      Dir["#{dir}#{dirname}/**/*.erb"].each do |template|
        @text = File.read(template)
        puts "Parsing: " + template.gsub(/#{dir}#{dirname}/,'') if @verbose

        @metadata = metadata(@text)

        # Get the name and filter
        filename = template.split('/').last
        title    = filename.split('.').first
        @name    = @metadata['name'] || title
        @name    = [prefix, @name].compact.join()
        next if filter and not @name.match(/#{filter}/i)

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
end

# Setup Tests
namespace :test do
  desc "Test ForemanTemplates plugin"
  Rake::TestTask.new(:templates) do |t|
    test_dir = File.join(File.dirname(__FILE__), '..', 'test')
    t.libs << ["test",test_dir]
    t.pattern = "#{test_dir}/**/*_test.rb"
  end
end
Rake::Task[:test].enhance do
  Rake::Task['test:templates'].invoke
end
load 'tasks/jenkins.rake'
if Rake::Task.task_defined?('jenkins:unit')
  Rake::Task["jenkins:unit"].enhance do
    Rake::Task['test:templates'].invoke
  end
end
