# Code coverage
begin
  require 'simplecov'
  SimpleCov.start :rails do
    filters.clear
    add_filter do |src|
      src.filename unless src.filename =~ /foreman_templates/
    end
  end
rescue LoadError
  puts '-- SimpleCov coverage skipped, add simplecov to Gemfile.local to enable'
end

# This calls the main test_helper in Foreman-core
require 'test_helper'

# Add plugin to FactoryBot's paths
FactoryBot.definition_file_paths << File.join(File.dirname(__FILE__), 'factories')
FactoryBot.reload
