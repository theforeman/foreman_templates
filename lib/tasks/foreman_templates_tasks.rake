# Tasks
namespace :templates do
  desc 'Import templates according to settings'
  task :import => :environment do
    if Rake.application.top_level_tasks.include?('templates:sync')
      ActiveSupport::Deprecation.warn('templates:sync task has been renamed to templates:import and will be removed in a future version')
    end
    # Available options:
    # * verbose   => Print extra information during the run [false]
    # * repo      => Sync templates from a different Git repo [https://github.com/theforeman/community-templates]
    # * branch    => Branch in Git repo [default branch]
    # * prefix    => The string all imported templates should begin with [Community ]
    # * dirname   => The directory within the git tree containing the templates [/]
    # * filter    => Import names matching this regex (case-insensitive; snippets are not filtered)
    # * associate => Associate to OS's, Locations & Organizations. Options are: always, new or never  [new]

    User.current = User.anonymous_admin

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
    User.current = User.anonymous_admin

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
    User.current = User.anonymous_admin

    ForemanTemplates::TemplateImporter.new({
      # * negate  => negate query [false]
      # * prefix  => The string all templates to purge should ( or not ) begin with [Community ]
      # * verbose => Print extra information during the run [false]
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

  desc 'Validate template'
  task :validate => :environment do
    require 'tempfile'
    template_source_file = ARGV[1]
    template_source_buffer = File.read(template_source_file)
    template_destination = File.basename(template_source_file, '.erb')

    Tempfile.open([template_destination, '.erb']) do |modified_template|
      modified_template_buffer = ForemanTemplates::ErbStrip.new(template_source_buffer).strip
      modified_template.write(modified_template_buffer)
      modified_template.flush
      json_temp_file = Tempfile.new(['template_report', '.json'])
      json_temp_file_name = json_temp_file.path
      json_temp_file.close # we don't need this file to remain open.
      rubocop_folder = File.expand_path(File.dirname(__FILE__) + "/../rubocop")
      `cat #{modified_template.path} | rubocop -d -s "#{template_source_file}" -r "#{rubocop_folder}/foreman_callback_cop.rb" --only "Foreman/ForemanUrl" -r "#{rubocop_folder}/foreman_erb_monkey_patch.rb" --format json --out #{json_temp_file_name}`
      ForemanTemplates::RubocopJsonProcessor.new(json_temp_file_name).to_clang
      json_temp_file.unlink
    end
  end
end
