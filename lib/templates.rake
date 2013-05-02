require 'open4'

desc <<-END_DESC
Synchronize templates from a git repo
END_DESC
namespace :templates do
  task :sync => :environment do

    # Available options:
    #* verbose => Print extra information during the run [false]
    #* repo    => Sync templates from a different Git repo [https://github.com/theforeman/community-templates]
    #* prefix  => The string all imported templates should begin with [Community]
    #* dirname => The directory within the git tree containing the templates [/]
    #* filter  => Import names matching this regex (case-insensitive; snippets are not filtered)

    verbose = ( ENV['verbose'] and ENV['verbose'] != 'false' ) ? true : false
    repo    = ENV['repo'] ? ENV['repo'] : "https://github.com/theforeman/community-templates.git"
    prefix  = ENV['prefix'] ? ENV['prefix'] : 'Community'
    dirname = ENV['dirname'] ? ENV['dirname'] : '/'
    filter  = ENV['filter'] ? ENV['filter'] : nil

    # Check out the community templates to a temp location
    dir     = Dir.mktmpdir
    command = "git clone #{repo} #{dir}"

    status = `#{command}`
    puts "#{status}" if verbose

    TemplateKind.all.each do |kind|
      Dir["#{dir}#{dirname}/**/*#{kind.name}.erb"].each do |template|
        os       = File.expand_path('../..',template).split('/').last.capitalize
        release  = File.expand_path('..',template).split('/').last.capitalize
        filename = template.split('/').last
        title    = filename.split('.').first
        name     = "#{prefix} #{os}(#{release}) #{title}"
        next if filter and not name.match(/#{filter}/i)

        oses = begin
          by_type = Operatingsystem.find_all_by_type(os)
          by_type.empty? ? Operatingsystem.where("name LIKE ?", os) : by_type
        rescue
          []
        end.delete_if {|o| !(o.major =~ /#{release}/i or o.release_name =~ /#{release}/i )}

        osfamily = oses.map{|o|o.type}.uniq.first

        db_template = ConfigTemplate.find_or_initialize_by_name(name)
        data = {
          :template         => File.read(template),
          :snippet          => false,
          :template_kind_id => kind.id
        }
        if db_template.new_record?
          data[:operatingsystem_ids] = oses.map {|o| o.id}
          string = "Created"
        else
          string = "Updated"
        end

        puts "#{string} Template id #{db_template.id || "new"}:#{name}" if verbose
        db_template.update_attributes(data)
      end
    end

    Dir["#{dir}#{dirname}/**/*disklayout.erb"].each do |ptable|
      os       = File.expand_path('../..',ptable).split('/').last.capitalize
      release  = File.expand_path('..',ptable).split('/').last.capitalize
      filename = ptable.split('/').last
      title    = filename.split('.').first
      name     = "#{prefix} #{os}(#{release}) #{title}"
      next if filter and not name.match(/#{filter}/i)

      oses = begin
        by_type = Operatingsystem.find_all_by_type(os)
        by_type.empty? ? Operatingsystem.where("name LIKE ?", os) : by_type
      rescue
        []
      end.delete_if {|o| !(o.major =~ /#{release}/i or o.release_name =~ /#{release}/i )}

      osfamily = oses.map{|o|o.type}.uniq.first

      db_ptable = Ptable.find_or_initialize_by_name(name)
      data = { :layout => File.read(ptable) }
      if db_ptable.new_record?
        data[:os_family] = osfamily
        data[:operatingsystems] = oses
        string = "Created"
      else
        string = "Updated"
      end

      puts "#{string} Ptable id #{db_ptable.id || 'new'}:#{name}" if verbose
      db_ptable.update_attributes(data)
    end

    Dir["#{dir}#{dirname}/snippets/*.erb"].each do |snippet|
      name = snippet.split('/').last.gsub(/.erb$/,'')

      db_snippet = ConfigTemplate.find_or_initialize_by_name(name)
      data = {
        :template => File.read(snippet),
        :snippet => true
      }
      string = db_snippet.new_record? ? "Created" : "Updated"

      puts "#{string} Snippet id #{db_snippet.id || 'new'}:#{name}" if verbose
      db_snippet.update_attributes(data)
    end

    # TODO do this in ruby
    `rm -rf #{dir}`

  end
end
