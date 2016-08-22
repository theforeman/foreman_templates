require 'test_plugin_helper'

module ForemanTemplates
  class TemplateImporterTest < ActiveSupport::TestCase
    def get_template(name)
      File.expand_path(File.join('..', '..', 'templates', name), __FILE__)
    end

    def importer(opts = {})
      # This uses a checkout of the plugin tests as a source of templates
      # Caveat: changes to /test/templates will need to be committed for tests to work
      ForemanTemplates::TemplateImporter.new({
        repo:      'https://github.com/theforeman/foreman_templates.git',
        prefix:    'FooBar ',
        dirname:   '/test/templates',
        verbose:   'false',
        associate: 'new'
      }.merge(opts))
    end

    setup do
      # Need to be admin to create templates
      User.current = users :admin
      @repo = Struct.new(:branches).new([
                                          Struct.new(:name).new('0.1-stable'),
                                          Struct.new(:name).new('develop')
                                        ])

      @importer = importer
    end

    context 'get_default_branch' do
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

    test 'map_oses returns OSes that are in the db' do
      metadata = { 'oses' => ['centos 5.3', 'Fedora 19'] }
      assert_equal [Operatingsystem.find_by_title('centos 5.3')], Ptable.map_oses(metadata)
      assert_equal [Operatingsystem.find_by_title('centos 5.3')], ProvisioningTemplate.map_oses(metadata)
    end

    test 'map_oses returns an empty array for no matched OSes' do
      metadata = { 'oses' => ['Fedora 19'] }
      assert_equal [], Ptable.map_oses(metadata)
      assert_equal [], ProvisioningTemplate.map_oses(metadata)
    end

    test 'metadata method extracts correct metadata' do
      text = File.read(get_template('metadata1.erb'))
      hash = @importer.parse_metadata(text)
      assert_equal 'provision', hash['kind']
      assert_equal 'Test Data', hash['name']
      assert_equal 5, hash['oses'].size
    end

    context 'os association:' do
      # default value of 'new' is implicitly tested by the sync task test
      # TODO test update_ptable and update_snippet too
      test 'when associate is never, os should be unaffected on create' do
        # Set up the data wanted by import!
        os       = FactoryGirl.create(:operatingsystem)
        name     = 'New Name'
        text     = 'New template data'
        metadata = {
          'kind'      => 'provision',
          'oses'      => [os.to_label],
          'associate' => 'never'
        }

        ProvisioningTemplate.import!(name, text, metadata) # creates new template

        ct = ProvisioningTemplate.find_by_name(name)
        assert_equal [], ct.operatingsystems
      end

      test 'when associate is always, os should be updated for existing templates' do
        # create a basic template with no OS assigned
        tk = FactoryGirl.create(:template_kind)
        os = FactoryGirl.create(:operatingsystem)
        pt = FactoryGirl.create(:provisioning_template, :template_kind => tk, :operatingsystems => [])

        # Set up the data wanted by import!
        name     = pt.name
        text     = 'New template data'
        metadata = {
          'kind'      => tk.name,
          'oses'      => [os.to_label],
          'associate' => 'always'
        }

        ProvisioningTemplate.import!(name, text, metadata) # creates new template

        ct = ProvisioningTemplate.find_by_name(name)
        assert_equal [os], ct.operatingsystems
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
