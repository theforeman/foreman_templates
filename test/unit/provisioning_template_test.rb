require 'test_plugin_helper'

module ForemanTemplates
  class ProvisioningTemplateTest < ActiveSupport::TestCase
    setup do
      # create a basic template with no OS assigned
      @tk      = FactoryBot.create(:template_kind)
      @os_old  = FactoryBot.create(:operatingsystem)
      @os_new  = FactoryBot.create(:operatingsystem)
      @new_org = FactoryBot.create(:organization, :name => 'NewOrg')
      @new_loc = FactoryBot.create(:location, :name => 'NewLoc')
      @pt      = FactoryBot.create(:provisioning_template,
                                    :template_kind => @tk,
                                    :operatingsystems => [@os_old])

      # Set up the data wanted by import!
      @name     = @pt.name
      @text     = @pt.template
      @metadata = {
        'kind'          => @tk.name,
        'oses'          => [@os_new.to_label],
        'associate'     => 'new',
        'organizations' => [@new_org.name],
        'locations'     => [@new_loc.name]
      }
    end

    context 'import' do
      test 'should create a template' do
        name = 'New Associate'
        ProvisioningTemplate.import!(name, 'New Text', @metadata)

        pt = ProvisioningTemplate.find_by(name: name)
        assert_equal 'New Text', pt.template
      end

      test 'should update an existing template' do
        ProvisioningTemplate.import!(@name, 'New Text', @metadata)

        pt = ProvisioningTemplate.find_by(name: @name)
        assert_equal 'New Text', pt.template
      end

      test 'should not change a template if the text matches' do
        r = ProvisioningTemplate.import!(@name, @text, @metadata)

        pt = ProvisioningTemplate.find_by(name: @name)
        assert_equal @text, pt.template
        assert r[:diff].nil?
      end
    end

    context 'import snippet' do
      test 'should create a snippet' do
        ProvisioningTemplate.import!('Snippet', 'New Text', 'kind' => 'snippet')

        s = ProvisioningTemplate.find_by(name: 'Snippet')
        assert s.snippet?
        assert_equal 'New Text', s.template
      end

      test 'should update an existing snippet' do
        s = FactoryBot.create(:provisioning_template, :snippet)
        ProvisioningTemplate.import!(s.name, 'New Text', 'kind' => 'snippet')

        s1 = ProvisioningTemplate.find_by(name: s.name)
        assert_equal 'New Text', s1.template
      end

      test 'should not change a snippet if the text matches' do
        s = FactoryBot.create(:provisioning_template, :snippet)
        r = ProvisioningTemplate.import!(s.name, s.template, 'kind' => 'snippet')

        s1 = ProvisioningTemplate.find_by(name: s.name)
        assert r[:diff].nil?
        assert_equal s.template, s1.template
      end

      test 'should create a snippet via snippet metadata flag' do
        md = { 'snippet' => true, 'kind' => 'not_used' }
        ProvisioningTemplate.import!('Snippet', 'New Text', md)

        s = ProvisioningTemplate.find_by(name: 'Snippet')
        assert s.snippet?
        assert_equal 'New Text', s.template
      end
    end

    context 'when associate=new' do
      test 'os/org/loc should be set for a new template' do
        name = 'New Associate'
        ProvisioningTemplate.import!(name, @text, @metadata)

        ct = ProvisioningTemplate.find_by(name: name)
        assert_equal [@os_new], ct.operatingsystems
        assert ct.organization_ids.include?(@new_org.id)
        assert ct.location_ids.include?(@new_loc.id)
      end

      test 'os/org/loc should be unchanged for an existing template' do
        ProvisioningTemplate.import!(@name, @text, @metadata)

        ct = ProvisioningTemplate.find_by(name: @name)
        assert_equal [@os_old], ct.operatingsystems
        refute ct.organization_ids.include?(@new_org.id)
        refute ct.location_ids.include?(@new_loc.id)
      end
    end

    context 'when associate=always' do
      def setup
        @metadata['associate'] = 'always'
      end

      test 'os/org/loc should be set for a new template' do
        name = 'Always Associate'
        ProvisioningTemplate.import!(name, @text, @metadata)

        ct = ProvisioningTemplate.find_by(name: name)
        assert_equal [@os_new], ct.operatingsystems
        assert ct.organization_ids.include?(@new_org.id)
        assert ct.location_ids.include?(@new_loc.id)
      end

      test 'os/org/loc should be updated for an existing template' do
        ProvisioningTemplate.import!(@name, @text, @metadata)

        ct = ProvisioningTemplate.find_by(name: @name)
        assert_equal [@os_new], ct.operatingsystems
        assert ct.organization_ids.include?(@new_org.id)
        assert ct.location_ids.include?(@new_loc.id)
      end
    end

    context 'when associate=never' do
      def setup
        @metadata['associate'] = 'never'
      end

      test 'os/org/loc should be unset for a new template' do
        name = 'Never Associate'
        ProvisioningTemplate.import!(name, @text, @metadata)

        ct = ProvisioningTemplate.find_by(name: name)
        assert_equal [], ct.operatingsystems
        assert_equal [], ct.organization_ids
        assert_equal [], ct.location_ids
      end

      test 'os/org/loc should be unchanged for an existing template' do
        ProvisioningTemplate.import!(@name, @text, @metadata)

        ct = ProvisioningTemplate.find_by(name: @name)
        assert_equal [@os_old], ct.operatingsystems
        refute ct.organization_ids.include?(@new_org.id)
        refute ct.location_ids.include?(@new_loc.id)
      end
    end
  end
end
