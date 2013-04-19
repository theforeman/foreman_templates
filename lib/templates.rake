require 'open4'

desc <<-END_DESC
A task from ForemanTemplates!
END_DESC
namespace :templates do
  task :sync => :environment do

    verbose = ENV['verbose'] && ENV['verbose'] != 'false' ? true : false

    # Check out the community templates to a temp location
    dir     = Dir.mktmpdir
    repo    = "https://github.com/theforeman/community-templates.git"
    command = "git clone #{repo} #{dir}"

    begin
      status = Open4::popen4("#{command}") do |pid, stdin, stdout, stderr|
        puts "pid        : #{ pid }" if verbose
        puts "stdout     : #{ stdout.read.strip }" if verbose
        puts "stderr     : #{ stderr.read.strip }" if verbose
      end
    rescue Exception => e
      e.message
      e.backtrace
    end

    TemplateKind.all.each do |kind|
      Dir["#{dir}/**/#{kind.name}.erb"].each do |template|
        os      = File.expand_path('../..',template).split('/').last.capitalize
        release = File.expand_path('..',template).split('/').last.capitalize
        name = "Community #{os}(#{release}) #{kind.name.capitalize}"

        db_template = ConfigTemplate.find_or_initialize_by_name(name)

        db_template.update_attributes(
          :template         => File.read(template),
          :snippet          => false,
          :template_kind_id => kind.id
        )
      end
    end

    Dir["#{dir}/snippets/*.erb"].each do |snippet|
      name = snippet.split('/').last.gsub(/.erb$/,'')
      db_snippet = ConfigTemplate.find_or_initialize_by_name(name)

      db_snippet.update_attributes(
        :template => File.read(snippet),
        :snippet => true
      )
    end

    # TODO do this in ruby
    `rm -rf #{dir}`

  end
end
