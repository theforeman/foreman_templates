require 'test_plugin_helper'

module ForemanTemplates
  class TemplateImporterTest < ActiveSupport::TestCase
    def get_template(name, dir = 'core')
      File.expand_path(File.join('..', '..', 'templates', dir, name), __FILE__)
    end

    def importer(opts = {})
      # This uses a checkout of the plugin as a source of templates Caveat:
      # changes to /test/templates will need to be committed (locally) for
      # tests to work

      path = File.expand_path(File.join('..', '..', '..'), __FILE__)
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

    context 'metadata method' do
      test 'extracts correct metadata' do
        text = File.read(get_template('metadata1.erb'))
        hash = @importer.parse_metadata(text)
        assert_equal 'provision', hash['kind']
        assert_equal 'Test Data', hash['name']
        assert_equal 5, hash['oses'].size

        text = File.read(get_template('metadata2.erb'))
        hash = @importer.parse_metadata(text)
        assert_equal 'ProvisioningTemplate', hash['model']
      end

      test 'handles vim/emacs modelines' do
        text = "<%# vim:sw=2:ts=2:et\nkind: provision\nname: Modeline\n%>"
        hash = @importer.parse_metadata(text)
        assert_equal 'provision', hash['kind']
        assert_equal 'Modeline', hash['name']
      end
    end

    context 'other plugins' do
      test 'are ignored if not installed' do
        # Somehow this persists if the next test runs first
        Object.send(:remove_const, :TestTemplate) if defined? TestTemplate

        @importer = importer(:dirname => '/test/templates/plugins')
        results = @importer.import!

        # Check core template was imported
        ct = Template.find_by_name('FooBar CoreTest')
        assert ct.present?
        assert_equal File.read(get_template('core.erb', 'plugins')), ct.template

        # Check plugin template was not imported
        ct = Template.find_by_name('FooBar PluginTest')
        refute ct.present?
        assert_equal results, ["  Skipping: 'FooBar PluginTest' - Unknown template model 'TestTemplate'"]
      end

      test 'can extend without changes' do
        # Test template class
        class ::TestTemplate < ::Template
          def self.import!(name, text, _metadata)
            audited # core tries to call :audit_comment, breaks without this
            template = TestTemplate.new(:name => name, :template => text)
            template.save!
          end
        end

        @importer = importer(:dirname => '/test/templates/plugins')
        @importer.import!

        # Check core template was imported
        ct = Template.find_by_name('FooBar CoreTest')
        assert ct.present?
        assert_equal File.read(get_template('core.erb', 'plugins')), ct.template

        # Check plugin template was imported
        ct = Template.find_by_name('FooBar PluginTest')
        assert ct.present?
        assert_equal File.read(get_template('plugin.erb', 'plugins')), ct.template
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

    test 'purge! removes expected templates' do
      # Create more than one template as we expect to delete all 'FooBar '
      # templates.
      FactoryGirl.create(:provisioning_template, :name => 'FooBar delete_me')
      FactoryGirl.create(:provisioning_template, :name => 'FooBar delete_me_too')
      FactoryGirl.create(:provisioning_template, :name => 'keep_me')
      count = ProvisioningTemplate.all.size
      @importer.purge!
      refute ProvisioningTemplate.find_by_name('FooBar %').present?
      assert ProvisioningTemplate.find_by_name('keep_me').present?
      assert ProvisioningTemplate.all.size, count - 2
    end # 'purge! removes expected template'

    test 'purge! negated purge leaves expected templates' do
      FactoryGirl.create(:provisioning_template, :name => 'FooBar keep_me')
      @importer = importer(:negate => true)
      @importer.purge!
      assert ProvisioningTemplate.find_by_name('FooBar keep_me').present?
      assert ProvisioningTemplate.all.size, 1
    end # 'purge! removes expected template'

    context 'map_metadata' do
      test 'returns OSes that are in the db' do
        metadata = { 'oses' => ['centos 5.3', 'Fedora 19'] }
        assert_equal [Operatingsystem.find_by_title('centos 5.3')], Template.map_metadata(metadata, 'oses')
      end

      test 'returns Orgs that are in the db' do
        metadata = { 'organizations' => ['Organization 1', 'Organization One'] }
        assert_equal [Organization.find_by_name('Organization 1')],
                     Template.map_metadata(metadata, 'organizations')
      end

      test 'returns Locations that are in the db' do
        metadata = { 'locations' => ['Location 1', 'Location One'] }
        assert_equal [Location.find_by_name('Location 1')],
                     Template.map_metadata(metadata, 'locations')
      end

      test 'returns an empty array for no matched OSes' do
        metadata = { 'oses' => ['Fedora 19'] }
        assert_equal [], Template.map_metadata(metadata, 'oses')
      end

      test 'returns an empty array for no matched Org' do
        metadata = { 'organizations' => ['Organization One'] }
        assert_equal [], Template.map_metadata(metadata, 'organizations')
      end

      test 'returns an empty array for no matched Location' do
        metadata = { 'locations' => ['Location One'] }
        assert_equal [], Template.map_metadata(metadata, 'locations')
      end

      test 'map_metadata defaults to an emtpy array' do
        metadata = {}
        [ 'oses', 'locations', 'organizations' ].each do |param|
          assert_equal [], Template.map_metadata(metadata, param)
        end
      end
    end
  end
end
