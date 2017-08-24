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
