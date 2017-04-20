# Tasks
namespace :templates do
  desc 'Import templates according to settings'
  task :import => :environment do
    if Rake.application.top_level_tasks.include?('templates:sync')
      ActiveSupport::Deprecation.warn('templates:sync task has been renamed to templates:import and will be removed in a future version')
    end
    # Available options:
    #* verbose   => Print extra information during the run [false]
    #* repo      => Sync templates from a different Git repo [https://github.com/theforeman/community-templates]
    #* branch    => Branch in Git repo [default branch]
    #* prefix    => The string all imported templates should begin with [Community ]
    #* dirname   => The directory within the git tree containing the templates [/]
    #* filter    => Import names matching this regex (case-insensitive; snippets are not filtered)
    #* associate => Associate to OS's, Locations & Organizations. Options are: always, new or never  [new]

    results = ForemanTemplates::TemplateImporter.new({
      verbose:   ENV['verbose'],
      repo:      ENV['repo'],
      branch:    ENV['branch'],
      prefix:    ENV['prefix'],
      dirname:   ENV['dirname'],
      filter:    ENV['filter'],
      associate: ENV['associate'],
    }).import!

    puts results.join("\n")
  end

  task :sync => :import

  desc 'Export templates according to settings'
  task :export => :environment do
    ForemanTemplates::TemplateExporter.new({
      verbose:   ENV['verbose'],
      repo: ENV['repo'],
      branch: ENV['branch'],
      prefix: ENV['prefix'],
      dirname: ENV['dirname'],
      filter: ENV['filter'],
      # associate: ENV['associate'],
      metadata_export_mode: ENV['metadata_export_mode'],
    }).export!

    puts 'Export finished'
  end

  desc 'Purge unwanted templates from foreman'
  task :purge => :environment do
    ForemanTemplates::TemplateImporter.new({
      #* negate  => negate query [false]
      #* prefix  => The string all templates to purge should ( or not ) begin with [Community ]
      #* verbose => Print extra information during the run [false]
      negate:  ENV['negate'],
      prefix:  ENV['prefix'],
      verbose: ENV['verbose'],
    }).purge!
  end

  desc 'Clean default data created by this plugin, this will permanently delete the data!'
  task :cleanup => :environment do
    puts 'Cleaning data...'
    ForemanTemplates::Cleaner.new.clean_up!
    puts 'Clean up finished, you can now remove the plugin from your system'
  end

end

# Tests
namespace :test do
  desc "Test ForemanTemplates"
  Rake::TestTask.new(:foreman_templates) do |t|
    test_dir = File.join(File.dirname(__FILE__), '../..', 'test')
    t.libs << ['test', test_dir]
    t.pattern = "#{test_dir}/**/*_test.rb"
    t.verbose = true
    t.warning = false
  end
end

namespace :foreman_templates do
  task :rubocop do
    begin
      require 'rubocop/rake_task'
      RuboCop::RakeTask.new(:rubocop_foreman_templates) do |task|
        task.patterns = ["#{ForemanTemplates::Engine.root}/app/**/*.rb",
                         "#{ForemanTemplates::Engine.root}/lib/**/*.rb",
                         "#{ForemanTemplates::Engine.root}/test/**/*.rb"]
      end
    rescue
      puts 'Rubocop not loaded.'
    end

    Rake::Task['rubocop_foreman_templates'].invoke
  end
end

Rake::Task[:test].enhance ['test:foreman_templates']

load 'tasks/jenkins.rake'
if Rake::Task.task_defined?(:'jenkins:unit')
  Rake::Task['jenkins:unit'].enhance ['test:foreman_templates', 'foreman_templates:rubocop']
end
