require 'test_plugin_helper'

module ForemanTemplates
  class TemplateImporterTest < ActiveSupport::TestCase
    def get_template(name,dir='core')
      File.expand_path(File.join('..', '..', 'templates', dir, name), __FILE__)
    end

    def importer(opts = {})
      # This uses a checkout of the plugin as a source of templates Caveat:
      # changes to /test/templates will need to be committed (locally) for
      # tests to work

      path = File.expand_path(File.join('..','..','..'),__FILE__)
      ForemanTemplates::TemplateImporter.new({
        :repo      => path,
        :branch    => Git.open(path).current_branch,
        :prefix    => 'FooBar ',
        :dirname   => '/test/templates/core',
        :verbose   => 'false',
        :associate => 'new'
      }.merge(opts))
    end

    setup do
      @importer = importer
    end

    context 'get_default_branch' do
      setup do
        @repo = Struct.new(:branches).new([
          Struct.new(:name).new('0.1-stable'),
          Struct.new(:name).new('develop')
        ])
      end

      test 'when on develop, returns develop' do
        SETTINGS[:version].stubs(:tag).returns('develop')
        assert_equal 'develop', @importer.get_default_branch(@repo)
      end

      test 'when branch exists, return it' do
        SETTINGS[:version].stubs(:tag).returns('not_develop')
        SETTINGS[:version].stubs(:short).returns('0.1')
        assert_equal '0.1-stable', @importer.get_default_branch(@repo)
      end

      test 'when branch does not exist, use default branch' do
        SETTINGS[:version].stubs(:tag).returns('not_develop')
        SETTINGS[:version].stubs(:short).returns('0.2')
        refute @importer.get_default_branch(@repo)
      end
    end

    test 'metadata method extracts correct metadata' do
      text = File.read(get_template('metadata1.erb'))
      hash = @importer.parse_metadata(text)
      assert_equal 'provision', hash['kind']
      assert_equal 'Test Data', hash['name']
      assert_equal 5, hash['oses'].size

      text = File.read(get_template('metadata2.erb'))
      hash = @importer.parse_metadata(text)
      assert_equal 'ProvisioningTemplate', hash['model']
    end

    context 'other plugins' do
      test 'are ignored if not installed' do
        @importer = importer({:dirname => '/test/templates/plugins'})
        results = @importer.import!

        # Check core template was imported
        ct = Template.find_by_name('FooBar CoreTest')
        assert ct.present?
        assert_equal File.read(get_template('core.erb','plugins')), ct.template

        # Check plugin template was not imported
        ct = Template.find_by_name('FooBar PluginTest')
        refute ct.present?
        assert_equal results, ["  Skipping: 'FooBar PluginTest' - Unknown template model 'TestTemplate'"]

      end

      test 'can extend without changes' do
        # Test template class
        class ::TestTemplate < ::Template
          def self.import!(name, text, metadata)
            audited # core tries to call :audit_comment, breaks without this
            template = TestTemplate.new(:name => name, :template => text)
            template.save!
          end
        end

        @importer = importer({:dirname => '/test/templates/plugins'})
        results = @importer.import!

        # Check core template was imported
        ct = Template.find_by_name('FooBar CoreTest')
        assert ct.present?
        assert_equal File.read(get_template('core.erb','plugins')), ct.template

        # Check plugin template was imported
        ct = Template.find_by_name('FooBar PluginTest')
        assert ct.present?
        assert_equal File.read(get_template('plugin.erb','plugins')), ct.template
      end
    end

    test 'import! loads templates into db' do
      @importer.import!

      # Check template was imported
      ct = ProvisioningTemplate.find_by_name('FooBar Test Data')
      assert ct.present?
      assert_equal File.read(get_template('metadata1.erb')), ct.template
      assert_equal 1, ct.operatingsystems.size
      assert_equal Operatingsystem.find_by_title('Ubuntu 10.10').id, ct.operatingsystems.first.id

      # Check model-based template was imported
      ct = ProvisioningTemplate.find_by_name('FooBar Model-based Test')
      assert ct.present?
      assert_equal File.read(get_template('metadata2.erb')), ct.template
      assert_equal 1, ct.operatingsystems.size
      assert_equal Operatingsystem.find_by_title('Ubuntu 10.10').id, ct.operatingsystems.first.id

      # Check snippet was imported
      sp = ProvisioningTemplate.find_by_name('FooBar Test Snippet')
      assert sp.present?
      assert_equal File.read(get_template('snippet1.erb')), sp.template

      # Check ptable was imported
      pt = Ptable.find_by_name('FooBar Test Ptable')
      assert pt.present?
      assert_equal File.read(get_template('ptable1.erb')), pt.layout
      assert_equal 'Debian', pt.os_family
    end
  end
end
