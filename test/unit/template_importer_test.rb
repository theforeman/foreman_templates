require 'test_plugin_helper'

module ForemanTemplates
  # rubocop:disable ClassLength
  class TemplateImporterTest < ActiveSupport::TestCase
    def get_template(name, dir = 'core')
      File.expand_path(File.join('..', '..', 'templates', dir, name), __FILE__)
    end

    def importer(opts = {})
      # This uses a checkout of the plugin as a source of templates Caveat:
      # changes to /test/templates will need to be committed (locally) for
      # tests to work

      ForemanTemplates::TemplateImporter.new({
        :repo => @engine_root,
        :branch => Git.open(@engine_root).current_branch,
        :prefix => 'FooBar ',
        :dirname => '/test/templates/core',
        :verbose => 'false',
        :associate => 'new'
      }.merge(opts))
    end

    setup do
      @engine_root = File.expand_path(File.join('..', '..', '..'), __FILE__)
      @importer = importer
    end

    context 'other plugins' do
      test 'are ignored if not installed' do
        # Somehow this persists if the next test runs first
        ForemanTemplates::TemplateImporterTest.send(:remove_const, :TestTemplate) if defined? ForemanTemplates::TemplateImporterTest::TestTemplate

        @importer = importer(:dirname => '/test/templates/plugins')
        results = @importer.import!

        # Check core template was imported
        ct = Template.find_by(name: 'FooBar CoreTest')
        assert ct.present?
        assert_equal File.read(get_template('core.erb', 'plugins')), ct.template

        # Check plugin template was not imported
        ct_name = 'FooBar PluginTest'
        ct = Template.find_by(name: ct_name)
        refute ct.present?
        ct_result = find_result(results[:results], ct_name)
        refute ct_result.imported
        assert_includes ct_result.additional_errors, "Template type ForemanTemplates::TemplateImporterTest::TestTemplate was not found, are you missing a plugin?"
      end

      test 'can extend without changes' do
        # Test template class
        class TestTemplate < ::Template
          include Taxonomix

          def self.import!(name, text, opts = { :force => false, :lock => false })
            template = TestTemplate.new(:name => name, :template => text)
            template.save!
          end

          def audit_comment
          end
        end

        @importer = importer(:dirname => '/test/templates/plugins')
        @importer.import!

        # Check core template was imported
        ct = Template.find_by(name: 'FooBar CoreTest')
        assert ct.present?
        assert_equal File.read(get_template('core.erb', 'plugins')), ct.template

        # Check plugin template was imported
        ct = Template.find_by(name: 'FooBar PluginTest')
        assert ct.present?
        assert_equal File.read(get_template('plugin.erb', 'plugins')), ct.template
      end
    end

    test 'import! loads templates into db' do
      @importer.import!

      # Check template was imported
      ct = ProvisioningTemplate.find_by(name: 'FooBar Test Data')
      assert ct.present?
      assert_equal File.read(get_template('metadata1.erb')), ct.template
      assert_equal 1, ct.operatingsystems.size
      assert_equal Operatingsystem.find_by(title: 'Ubuntu 10.10').id, ct.operatingsystems.first.id

      # Check model-based template was imported
      ct = ProvisioningTemplate.find_by(name: 'FooBar Model-based Test')
      assert ct.present?
      assert_equal File.read(get_template('metadata2.erb')), ct.template
      assert_equal 1, ct.operatingsystems.size
      assert_equal Operatingsystem.find_by(title: 'Ubuntu 10.10').id, ct.operatingsystems.first.id

      # Check snippet was imported
      sp = ProvisioningTemplate.find_by(name: 'FooBar Test Snippet')
      assert sp.present?
      assert_equal File.read(get_template('snippet1.erb')), sp.template

      # Check ptable was imported
      pt = Ptable.find_by(name: 'FooBar Test Ptable')
      assert pt.present?
      assert_equal File.read(get_template('ptable1.erb')), pt.layout
      assert_equal 'Debian', pt.os_family
    end

    test 'purge! removes expected templates' do
      # Create more than one template as we expect to delete all 'FooBar '
      # templates.
      FactoryBot.create(:provisioning_template, :name => 'FooBar delete_me')
      FactoryBot.create(:provisioning_template, :name => 'FooBar delete_me_too')
      FactoryBot.create(:provisioning_template, :name => 'keep_me')
      count = ProvisioningTemplate.all.size
      @importer.purge!
      refute ProvisioningTemplate.find_by(name: 'FooBar %').present?
      assert ProvisioningTemplate.find_by(name: 'keep_me').present?
      assert ProvisioningTemplate.all.size, count - 2
      # 'purge! removes expected template'
    end

    test 'purge! negated purge leaves expected templates' do
      FactoryBot.create(:provisioning_template, :name => 'FooBar keep_me')
      @importer = importer(:negate => true)
      @importer.purge!
      assert ProvisioningTemplate.find_by(name: 'FooBar keep_me').present?
      assert ProvisioningTemplate.all.size, 1
      # 'purge! removes expected template'
    end

    test 'should create importer with defaults from Settings' do
      setup_settings
      imp = ForemanTemplates::TemplateImporter.new
      imp.class.setting_overrides.each do |attribute|
        next if assert_both_equal_nil imp.public_send(attribute), Setting["template_sync_#{attribute}".to_sym]

        assert_equal imp.public_send(attribute), Setting["template_sync_#{attribute}".to_sym]
      end
    end

    test 'should create importer overriding defaults from Settings' do
      setup_settings
      args = { :verbose => true, :repo => 'http://coolest_templates_repo', :dirname => '/some/dir' }
      imp = ForemanTemplates::TemplateImporter.new(args)
      args.each do |key, value|
        assert_equal value, imp.public_send(key)
      end
    end

    test 'should import files from git' do
      setup_settings
      imp = ForemanTemplates::TemplateImporter.new
      succ = "Success!"
      imp.expects(:import_from_git).returns([succ])
      res = imp.import!
      assert_equal succ, res.first
    end

    test 'should import files from filesystem' do
      setup_settings :repo => @engine_root, :dirname => '/test/templates/core'
      imp = ForemanTemplates::TemplateImporter.new
      succ = "Success!"
      imp.expects(:import_from_files).returns([succ])
      res = imp.import!
      assert_equal succ, res.first
    end

    test 'should fail with exception when cannot find path on filesystem' do
      some_dir = File.expand_path(File.join('..', '..', '..', 'some_dir'), __FILE__)
      setup_settings :repo => some_dir
      imp = ForemanTemplates::TemplateImporter.new
      assert_raises ForemanTemplates::PathAccessException do |exception|
        imp.import!
        assert_equal exception.message, "Using file-based import, but couldn't find #{File.expand_path(some_dir)}"
      end
    end

    test 'should be able to use ~ in path' do
      home_dir = '~'
      setup_settings :repo => home_dir
      imp = ForemanTemplates::TemplateImporter.new
      succ = "Success!"
      imp.expects(:parse_files!).returns([succ])
      res = imp.import!
      assert_equal succ, res.first
    end

    test '#auto_prefix_name' do
      assert_equal 'FooBar something', @importer.auto_prefix('something')
      assert_equal 'FooBar something', @importer.auto_prefix('FooBar something')
      assert_equal 'FooBar template FooBar something', @importer.auto_prefix('template FooBar something')
    end

    test "should not update locked templates" do
      initial_path = "#{@engine_root}/test/templates/locking/core_initial"
      template_template = File.read("#{initial_path}/metadata1.erb")
      ptable_layout = File.read("#{initial_path}/ptable1.erb")
      snippet_template = File.read("#{initial_path}/snippet1.erb")

      provision = TemplateKind.find_by :name => 'provision'
      template = FactoryBot.create(:provisioning_template,
                                   :name => "Test Data",
                                   :template => template_template,
                                   :locked => true,
                                   :template_kind => provision)
      ptable = FactoryBot.create(:ptable, :name => "Test Ptable", :locked => true, :layout => ptable_layout)
      snippet = FactoryBot.create(:provisioning_template, :snippet, :name => "Test Snippet", :locked => true, :template => snippet_template)

      imp = importer(:dirname => '/test/templates/locking/core_updated', :verbose => true, :prefix => '', :locked => true)
      results = imp.import!

      template_res = find_result(results[:results], template.name)
      refute template_res.imported
      assert_equal template_res.errors.full_messages.first, "This template is locked. Please clone it to a new template to customize."

      ptable_res = find_result(results[:results], ptable.name)
      refute ptable_res.imported
      assert_equal ptable_res.errors.full_messages.first, "This template is locked. Please clone it to a new template to customize."

      snippet_res = find_result(results[:results], snippet.name)
      refute snippet_res.imported
      assert_equal snippet_res.errors.full_messages.first, "This template is locked. Please clone it to a new template to customize."

      assert_equal template_template, template.template
      assert_equal ptable_layout, ptable.layout
      assert_equal snippet_template, snippet.template
    end

    test "should update locked template when forced" do
      locking_path = "#{@engine_root}/test/templates/locking"
      initial_path = "#{locking_path}/core_initial"
      template_template = File.read("#{initial_path}/metadata1.erb")
      ptable_layout = File.read("#{initial_path}/ptable1.erb")
      snippet_template = File.read("#{initial_path}/snippet1.erb")

      provision = TemplateKind.find_by :name => 'provision'
      template = FactoryBot.create(:provisioning_template,
                                   :name => "Test Data",
                                   :template => template_template,
                                   :locked => true,
                                   :template_kind => provision)
      ptable = FactoryBot.create(:ptable, :name => "Test Ptable", :locked => true, :layout => ptable_layout)
      snippet = FactoryBot.create(:provisioning_template, :snippet, :name => "Test Snippet", :locked => true, :template => snippet_template)

      imp = importer(:dirname => '/test/templates/locking/core_updated', :verbose => true, :prefix => '', :force => true)
      results = imp.import!

      updated_path = "#{locking_path}/core_updated"
      new_template_template = File.read("#{updated_path}/metadata1.erb")
      new_ptable_layout = File.read("#{updated_path}/ptable1.erb")
      new_snippet_template = File.read("#{updated_path}/snippet1.erb")

      [template, snippet, ptable].map(&:reload)

      refute_equal template_template, template.template
      assert_equal new_template_template, template.template
      assert find_result(results[:results], template.name).imported

      refute_equal ptable_layout, ptable.layout
      assert_equal new_ptable_layout, ptable.layout
      assert find_result(results[:results], ptable.name).imported

      refute_equal snippet_template, snippet.template
      assert_equal new_snippet_template, snippet.template
      assert find_result(results[:results], snippet.name).imported
    end

    test "should have correct taxonomy options" do
      orgs = { :organization_ids => [3] }
      locs = { :location_ids => [5] }
      params = { :organization_params => orgs,
                 :location_params => locs }
      importer = ForemanTemplates::TemplateImporter.new params

      assert_equal orgs, importer.import_options[:organization_params]
      assert_equal locs, importer.import_options[:location_params]
    end

    private

    def setup_settings(opts = {})
      category = "Setting::TemplateSync"
      default_repo = opts[:repo] || 'https://github.com/theforeman/community-templates.git'
      default_dirname = opts[:dirname] || '/'
      default_branch = opts[:branch] || nil
      FactoryBot.create(:setting, :settings_type => "boolean", :category => category, :name => 'template_sync_verbose', :default => false)
      FactoryBot.create(:setting, :settings_type => "string", :category => category, :name => 'template_sync_associate', :default => "new")
      FactoryBot.create(:setting, :settings_type => "string", :category => category, :name => 'template_sync_prefix', :default => "Community ")
      FactoryBot.create(:setting, :settings_type => "string", :category => category, :name => 'template_sync_dirname', :default => default_dirname)
      FactoryBot.create(:setting, :settings_type => "string", :category => category, :name => 'template_sync_filter', :default => nil)
      FactoryBot.create(:setting, :settings_type => "string", :category => category, :name => 'template_sync_repo', :default => default_repo)
      FactoryBot.create(:setting, :settings_type => "boolean", :category => category, :name => 'template_sync_negate', :default => false)
      FactoryBot.create(:setting, :settings_type => "string", :category => category, :name => 'template_sync_branch', :default => default_branch)
    end

    def assert_both_equal_nil(expected, actual)
      if expected.nil? || actual.nil?
        assert_nil expected
        assert_nil actual
        true
      else
        false
      end
    end

    def find_result(results, template_name)
      results.find { |res| res.name == template_name }
    end
  end
  # rubocop:enable ClassLength
end
