require 'yaml'
require 'diffy'

class NoKindError < Exception ; end

def map_oses
  oses = if @metadata['oses']
           @metadata['oses'].map do |os|
             @db_oses.map { |db| db.to_label =~ /^#{os}/ ? db : nil}
           end.flatten.compact
         else
           []
         end
  puts "  Operatingsystem Associations: #{oses.map(&:fullname).join(',')}" if verbose
  return oses
end

def update_template
  # Get template type
  unless kind = TemplateKind.find_by_name(@metadata['kind'])
    puts "  Error: Unknown template type '#{@metadata['kind']}'"
    raise NoKindError
  end

  db_template = ConfigTemplate.find_or_initialize_by_name(@name)
  data = {
    :template         => @text,
    :snippet          => false,
    :template_kind_id => kind.id
  }

  if db_template.new_record?
    data[:operatingsystem_ids] = map_oses.map(&:id)
    string = "Created"
  else
    string = "Updated"
  end

  if @text == db_template.template
    puts "  No change to Template #{ ( 'id' + db_template.id ) rescue ''}:#{@name}"
  else
    update = Diffy::Diff.new(db_template.template, @text, :include_diff_info => true).to_s(:color)
    db_template.update_attributes(data)
    puts "  #{string} Template #{ 'id' + db_template.id rescue ''}:#{@name}"
    puts update if !db_template.new_record? and verbose
  end
end

def update_ptable
  oses = map_oses

  db_ptable = Ptable.find_or_initialize_by_name(@name)
  data = { :layout => @text }
  if db_ptable.new_record?
    data[:os_family] = oses.map(&:family).uniq.first
    #no idea why this fails...
    #data[:operatingsystems] = oses,
    string = "Created"
  else
    string = "Updated"
  end

  if @text == db_ptable.layout
    puts "  No change to Ptable #{ ( 'id' + db_ptable.id ) rescue ''}:#{@name}"
  else
    update = Diffy::Diff.new(db_ptable.layout, @text, :include_diff_info => true).to_s(:color)
    db_ptable.update_attributes(data)
    puts "  #{string} Ptable #{ ( 'id' + db_ptable.id ) rescue ''}:#{@name}"
    puts update if !db_ptable.new_record? and verbose
  end

end

def update_snippet
  db_snippet = ConfigTemplate.find_or_initialize_by_name(@name)
  data = {
    :template => @text,
    :snippet => true
  }
  string = db_snippet.new_record? ? "Created" : "Updated"

  if @text == db_snippet.template
    puts "  No change to Snippet #{ 'id' + db_snippet.id rescue ''}:#{@name}" if verbose
  else
    update = Diffy::Diff.new(db_snippet.template, @text, :include_diff_info => true).to_s(:color)
    db_snippet.update_attributes(data)
    puts "  #{string} Snippet #{ ('id' + db_snippet.id) rescue ''}:#{@name}" if verbose
    puts update if !db_snippet.new_record? and verbose
  end
end

desc <<-END_DESC
Synchronize templates from a git repo
END_DESC
namespace :templates do
  task :sync => :environment do
    # Available options:
    #* verbose => Print extra information during the run [false]
    #* repo    => Sync templates from a different Git repo [https://github.com/theforeman/community-templates]
    #* branch  => Branch in Git repo [default branch]
    #* prefix  => The string all imported templates should begin with [Community]
    #* dirname => The directory within the git tree containing the templates [/]
    #* filter  => Import names matching this regex (case-insensitive; snippets are not filtered)

    verbose = ( ENV['verbose'] and ENV['verbose'] != 'false' ) ? true : false
    repo    = ENV['repo'] ? ENV['repo'] : "https://github.com/theforeman/community-templates.git"
    branch  = ENV['branch'] ? "-b #{ENV['branch']}" : ""
    prefix  = ENV['prefix'] ? ENV['prefix'] : 'Community'
    dirname = ENV['dirname'] ? ENV['dirname'] : '/'
    filter  = ENV['filter'] ? ENV['filter'] : nil

    # Check out the community templates to a temp location
    dir     = Dir.mktmpdir
    command = "git clone #{branch} #{repo} #{dir}"

    status = `#{command}`
    puts "#{status}" if verbose

    # Cache the list of OSes
    @db_oses = Operatingsystem.all

    # Build a list of ERB files to parse
    Dir["#{dir}#{dirname}/**/*.erb"].each do |template|
      # Parse Metadata in the template
      options=""
      strip_metadata=""
      File.readlines(template).each do |line|
        if line =~ /^#/
          strip_metadata += line
          options        += line[1..-1]
        else
          break
        end
      end
      @metadata = options == "" ? {} : YAML.load(options)
      @text = File.read(template).gsub(/#{strip_metadata}/,'')

      # Get the name and filter
      filename = template.split('/').last
      title    = filename.split('.').first
      @name    = @metadata ['name']    || "#{prefix} #{title}"
      next if filter and not name.match(/#{filter}/i)

      puts "Parsing: " + template.gsub(/#{dir}#{dirname}/,'') if verbose

      unless @metadata['kind']
        puts "  Error: Must specify template kind"
        next
      end

      case @metadata['kind']
      when 'ptable'
        update_ptable
      when 'snippet'
        update_snippet
      else
        begin
          update_template
        rescue NoKindError
          next
        end
      end
    end

  end
end
