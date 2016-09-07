require 'test_plugin_helper'

module ForemanTemplates
  class PtableTest < ActiveSupport::TestCase
    setup do
      # create a basic template with no OS assigned
      @os_rh   = FactoryGirl.create(:operatingsystem, :family => 'Redhat')
      @os_deb  = FactoryGirl.create(:operatingsystem, :family => 'Debian')
      @pt      = FactoryGirl.create(:ptable, :os_family => 'Redhat')
      @new_org = FactoryGirl.create(:organization, :name => 'NewOrg')
      @new_loc = FactoryGirl.create(:location, :name => 'NewLoc')

      # Set up the data wanted by import!
      @name     = @pt.name
      @text     = @pt.template
      @metadata = {
        'oses'      => [@os_deb.to_label],
        'associate' => 'new',
        'organizations' => [@new_org.name], 
        'locations' => [@new_loc.name] 
      }
    end

    context 'import' do
      test 'should create a ptable' do
        name = 'New Associate'
        Ptable.import!(name, 'New Text', @metadata)

        pt = Ptable.find_by_name(name)
        assert_equal 'New Text', pt.layout
      end

      test 'should update an existing ptable' do
        Ptable.import!(@name, 'New Text', @metadata)

        pt = Ptable.find_by_name(@name)
        assert_equal 'New Text', pt.layout
      end

      test 'should not change a ptable if the text matches' do
        r = Ptable.import!(@name, @text, @metadata)

        pt = Ptable.find_by_name(@name)
        assert_equal @text, pt.layout
        assert r[:diff].nil?
      end
    end

    context 'when associate=new' do
      test 'family/org/loc should be set for a new ptable' do
        name = 'New Associate'
        Ptable.import!(name, @text, @metadata)

        pt = Ptable.find_by_name(name)
        assert_equal @os_deb.family, pt.os_family
        assert (pt.organization_ids.include? @new_org.id)
        assert (pt.location_ids.include? @new_loc.id)
      end

      test 'family/org/loc should be unchanged for an existing ptable' do
        Ptable.import!(@name, @text, @metadata)

        pt = Ptable.find_by_name(@name)
        assert_equal @os_rh.family, pt.os_family
        assert (not pt.organization_ids.include? @new_org.id)
        assert (not pt.location_ids.include? @new_loc.id)
      end
    end

    context 'when associate=always' do
      def setup
        @metadata['associate'] = 'always'
      end

      test 'family/org/loc should be set for a new ptable' do
        name = 'Always Associate'
        Ptable.import!(name, @text, @metadata)

        pt = Ptable.find_by_name(name)
        assert_equal @os_deb.family, pt.os_family
        assert (pt.organization_ids.include? @new_org.id)
        assert (pt.location_ids.include? @new_loc.id)
      end

      test 'family/org/loc should be updated for an existing ptable' do
        Ptable.import!(@name, @text, @metadata)

        pt = Ptable.find_by_name(@name)
        assert_equal @os_deb.family, pt.os_family
        assert (pt.organization_ids.include? @new_org.id)
        assert (pt.location_ids.include? @new_loc.id)
      end
    end

    context 'when associate=never' do
      def setup
        @metadata['associate'] = 'never'
      end

      test 'family/org/loc should be unset for a new ptable' do
        name = 'Never Associate'
        Ptable.import!(name, @text, @metadata)

        pt = Ptable.find_by_name(name)
        assert_nil pt.os_family
        assert_equal [], pt.organization_ids
        assert_equal [], pt.location_ids
      end

      test 'family/org/loc should be unchanged for an existing ptable' do
        Ptable.import!(@name, @text, @metadata)

        pt = Ptable.find_by_name(@name)
        assert_equal @os_rh.family, pt.os_family
        assert (not pt.organization_ids.include? @new_org.id)
        assert (not pt.location_ids.include? @new_loc.id)
      end
    end

    context 'import snippet' do
      test 'should create a snippet' do
        Ptable.import!('Snippet', 'New Text', 'snippet' => true)

        s = Ptable.find_by_name('Snippet')
        assert s.snippet?
        assert_equal 'New Text', s.template
      end

      test 'should update an existing snippet' do
        s = FactoryGirl.create(:ptable, :snippet => true)
        Ptable.import!(s.name, 'New Text', 'snippet' => true)

        s1 = Ptable.find_by_name(s.name)
        assert_equal 'New Text', s1.template
      end

      test 'should not change a snippet if the text matches' do
        s = FactoryGirl.create(:ptable, :snippet => true)
        r = Ptable.import!(s.name, s.template, 'snippet' => true)

        s1 = Ptable.find_by_name(s.name)
        assert r[:diff].nil?
        assert_equal s.template, s1.template
      end
    end
  end
end
