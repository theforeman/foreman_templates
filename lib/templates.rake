require 'open4'

desc <<-END_DESC
Synchronize templates from a git repo
END_DESC
namespace :templates do
  task :sync => :environment do

    # Available options:
    #   * repo    => the git repo to sync from (full URL)
    #   * verbose => print extra stuff

    verbose = ( ENV['verbose'] and ENV['verbose'] != 'false' ) ? true : false
    repo   = ENV['repo'] if ENV['repo']
    repo ||= "https://github.com/theforeman/community-templates.git"

    # Check out the community templates to a temp location
    dir     = Dir.mktmpdir
    command = "git clone #{repo} #{dir}"

    status = `command`
    puts "#{status}" if verbose
    
    TemplateKind.all.each do |kind|
      Dir["#{dir}/**/#{kind.name}.erb"].each do |template|
        os      = File.expand_path('../..',template).split('/').last.capitalize
        release = File.expand_path('..',template).split('/').last.capitalize
        name = "Community #{os}(#{release}) #{kind.name.capitalize}"

        db_template = ConfigTemplate.find_or_initialize_by_name(name)
        puts "Updating Template id #{db_template.id}:#{name}" if verbose

        db_template.update_attributes(
          :template         => File.read(template),
          :snippet          => false,
          :template_kind_id => kind.id
        )
      end
    end

    Dir["#{dir}/**/disklayout.erb"].each do |ptable|
      os      = File.expand_path('../..',ptable).split('/').last.capitalize
      release = File.expand_path('..',ptable).split('/').last.capitalize
      name = "Community #{os}(#{release}) Partitioning"

      db_ptable = Ptable.find_or_initialize_by_name(name)
      puts "Updating Ptable id #{db_ptable.id}:#{name}" if verbose

      db_ptable.update_attributes(
        :layout         => File.read(ptable)
      )
    end

    Dir["#{dir}/snippets/*.erb"].each do |snippet|
      name = snippet.split('/').last.gsub(/.erb$/,'')

      db_snippet = ConfigTemplate.find_or_initialize_by_name(name)
      puts "Updating Snippet id #{db_snippet.id}:#{name}" if verbose

      db_snippet.update_attributes(
        :template => File.read(snippet),
        :snippet => true
      )
    end

    # TODO do this in ruby
    `rm -rf #{dir}`

  end
end
