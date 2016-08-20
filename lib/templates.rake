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

    ForemanTemplates::TemplateImporter.new({
      verbose:   ENV['verbose'],
      repo:      ENV['repo'],
      branch:    ENV['branch'],
      prefix:    ENV['prefix'],
      dirname:   ENV['dirname'],
      filter:    ENV['filter'],
      associate: ENV['associate'],
    }).import!
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
