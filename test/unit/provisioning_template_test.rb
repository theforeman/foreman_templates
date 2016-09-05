require 'test_plugin_helper'

module ForemanTemplates
  class ProvisioningTemplateTest < ActiveSupport::TestCase
    setup do
      # create a basic template with no OS assigned
      @tk     = FactoryGirl.create(:template_kind)
      @os_old = FactoryGirl.create(:operatingsystem)
      @os_new = FactoryGirl.create(:operatingsystem)
      @pt     = FactoryGirl.create(:provisioning_template,
                                   :template_kind => @tk,
                                   :operatingsystems => [@os_old])

      # Set up the data wanted by import!
      @name     = @pt.name
      @text     = @pt.template
      @metadata = {
        'kind'      => @tk.name,
        'oses'      => [@os_new.to_label],
        'associate' => 'new'
      }
    end

    context 'import' do
      test 'should create a template' do
        name = 'New Associate'
        ProvisioningTemplate.import!(name, 'New Text', @metadata)

        pt = ProvisioningTemplate.find_by_name(name)
        assert_equal 'New Text', pt.template
      end

      test 'should update an existing template' do
        ProvisioningTemplate.import!(@name, 'New Text', @metadata)

        pt = ProvisioningTemplate.find_by_name(@name)
        assert_equal 'New Text', pt.template
      end

      test 'should not change a template if the text matches' do
        r = ProvisioningTemplate.import!(@name, @text, @metadata)

        pt = ProvisioningTemplate.find_by_name(@name)
        assert_equal @text, pt.template
        assert r[:diff].nil?
      end
    end

    context 'import snippet' do
      test 'should create a snippet' do
        ProvisioningTemplate.import!('Snippet', 'New Text', 'kind' => 'snippet')

        s = ProvisioningTemplate.find_by_name('Snippet')
        assert s.snippet?
        assert_equal 'New Text', s.template
      end

      test 'should update an existing snippet' do
        s = FactoryGirl.create(:provisioning_template, :snippet)
        ProvisioningTemplate.import!(s.name, 'New Text', 'kind' => 'snippet')

        s1 = ProvisioningTemplate.find_by_name(s.name)
        assert_equal 'New Text', s1.template
      end

      test 'should not change a snippet if the text matches' do
        s = FactoryGirl.create(:provisioning_template, :snippet)
        r = ProvisioningTemplate.import!(s.name, s.template, 'kind' => 'snippet')

        s1 = ProvisioningTemplate.find_by_name(s.name)
        assert r[:diff].nil?
        assert_equal s.template, s1.template
      end

      test 'should create a snippet via snippet metadata flag' do
        md = { 'snippet' => true, 'kind' => 'not_used' }
        ProvisioningTemplate.import!('Snippet', 'New Text', md)

        s = ProvisioningTemplate.find_by_name('Snippet')
        assert s.snippet?
        assert_equal 'New Text', s.template
      end
    end

    context 'when associate=new' do
      test 'os should be set for a new template' do
        name = 'New Associate'
        ProvisioningTemplate.import!(name, @text, @metadata)

        ct = ProvisioningTemplate.find_by_name(name)
        assert_equal [@os_new], ct.operatingsystems
      end

      test 'os should be unchanged for an existing template' do
        ProvisioningTemplate.import!(@name, @text, @metadata)

        ct = ProvisioningTemplate.find_by_name(@name)
        assert_equal [@os_old], ct.operatingsystems
      end
    end

    context 'when associate=always' do
      def setup
        @metadata['associate'] = 'always'
      end

      test 'os should be set for a new template' do
        name = 'Always Associate'
        ProvisioningTemplate.import!(name, @text, @metadata)

        ct = ProvisioningTemplate.find_by_name(name)
        assert_equal [@os_new], ct.operatingsystems
      end

      test 'os should be updated for an existing template' do
        ProvisioningTemplate.import!(@name, @text, @metadata)

        ct = ProvisioningTemplate.find_by_name(@name)
        assert_equal [@os_new], ct.operatingsystems
      end
    end

    context 'when associate=never' do
      def setup
        @metadata['associate'] = 'never'
      end

      test 'os should be unset for a new template' do
        name = 'Never Associate'
        ProvisioningTemplate.import!(name, @text, @metadata)

        ct = ProvisioningTemplate.find_by_name(name)
        assert_equal [], ct.operatingsystems
      end

      test 'os should be unchanged for an existing template' do
        ProvisioningTemplate.import!(@name, @text, @metadata)

        ct = ProvisioningTemplate.find_by_name(@name)
        assert_equal [@os_old], ct.operatingsystems
      end
    end

    context 'map_oses' do
      test 'returns OSes that are in the db' do
        metadata = { 'oses' => ['centos 5.3', 'Fedora 19'] }
        assert_equal [Operatingsystem.find_by_title('centos 5.3')],
                     ProvisioningTemplate.map_oses(metadata)
      end

      test 'returns an empty array for no matched OSes' do
        metadata = { 'oses' => ['Fedora 19'] }
        assert_equal [], ProvisioningTemplate.map_oses(metadata)
      end

      test 'defaults to an emtpy array' do
        metadata = {}
        assert_equal [], ProvisioningTemplate.map_oses(metadata)
      end
    end
  end
end
