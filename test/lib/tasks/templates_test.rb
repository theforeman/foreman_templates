require 'test_plugin_helper'
require 'rake'
require 'rake/testtask'

class PluginTemplateTest < ActiveSupport::TestCase
  setup do
    # Checkout the plugin tests as a source of templates
    # Caveat: changes to /test/templates will need to be committed for tests to work
    ENV['repo']      = 'https://github.com/theforeman/foreman_templates.git'
    ENV['prefix']    = 'FooBar '
    ENV['dirname']   = '/test/templates'
    ENV['verbose']   = 'false'
    ENV['associate'] = 'new'
    @repo = Struct.new(:branches).new(
      [
        Struct.new(:name).new('0.1-stable'),
        Struct.new(:name).new('develop')
      ]
    )

    # Load the task
    Rake.application.rake_require 'templates'
    Rake::Task.define_task(:environment)
    Rake::Task['templates:sync'].reenable

    # Need to be admin to create templates
    User.current = users :admin
  end

  context 'get_default_branch' do
    test 'when on develop, returns develop' do
      SETTINGS[:version].stubs(:tag).returns('develop')
      assert_equal 'develop', get_default_branch(@repo)
    end
    test 'when branch exists, return it' do
      SETTINGS[:version].stubs(:tag).returns('not_develop')
      SETTINGS[:version].stubs(:short).returns('0.1')
      assert_equal '0.1-stable', get_default_branch(@repo)
    end
    test 'when branch does not exist, use default branch' do
      SETTINGS[:version].stubs(:tag).returns('not_develop')
      SETTINGS[:version].stubs(:short).returns('0.2')
      refute get_default_branch(@repo)
    end
  end

  test 'map_oses returns OSes that are in the db' do
    @metadata = {}
    @metadata['oses'] = ['centos 5.3', 'Fedora 19']
    assert_equal 1, map_oses.size
    assert_equal Operatingsystem.find_by_title('centos 5.3').id, map_oses.first.id
  end

  test 'map_oses returns an empty array for no matched OSes' do
    @metadata = {}
    @db_oses = Operatingsystem.all
    @metadata['oses'] = ['Fedora 19']
    assert_equal [], map_oses
  end

  test 'metadata method extracts correct metadata' do
    text = File.read(get_template('metadata1.erb'))
    hash = metadata(text)
    assert_equal 'provision', hash['kind']
    assert_equal 'Test Data', hash['name']
    assert_equal 5, hash['oses'].size
  end

  test 'templates:sync loads templates into db' do
    Rake.application.invoke_task 'templates:sync'

    # Check template was imported
    ct = ConfigTemplate.find_by_name('FooBar Test Data')
    assert_present ct
    assert_equal File.read(get_template('metadata1.erb')), ct.template
    assert_equal 1, ct.operatingsystems.size
    assert_equal Operatingsystem.find_by_title('Ubuntu 10.10').id, ct.operatingsystems.first.id

    # Check snippet was imported
    sp = ConfigTemplate.find_by_name('FooBar Test Snippet')
    assert_present sp
    assert_equal File.read(get_template('snippet1.erb')), sp.template

    # Check ptable was imported
    pt = Ptable.find_by_name('FooBar Test Ptable')
    assert_present pt
    assert_equal File.read(get_template('ptable1.erb')), pt.layout
    assert_equal "Debian", pt.os_family
  end

  context 'os association:' do
    # default value of 'new' is implicitly tested by the sync task test
    # TODO test update_ptable and update_snippet too
    test 'when associate is never, os should be unaffected on create' do
      # Set up the data wanted by update_template
      @os        = FactoryGirl.create(:operatingsystem)
      @metadata  = { 'kind' => 'provision', 'oses' => [@os.to_label] }
      @name      = "New Name"
      @text      = "New template data"
      @associate = 'never'

      update_template # creates new template

      ct = ConfigTemplate.find_by_name(@name)
      assert_equal [], ct.operatingsystems
    end

    test 'when associate is always, os should be updated for existing templates' do
      # create a basic template with no OS assigned
      @tk = FactoryGirl.create(:template_kind)
      @os = FactoryGirl.create(:operatingsystem)
      @ct = FactoryGirl.create(:config_template, :template_kind => @tk, :operatingsystems => [])

      # Set up the data wanted by update_template
      @metadata  = { 'kind' => @tk.name, 'oses' => [@os.to_label] }
      @name      = @ct.name
      @text      = "New template data"
      @associate = 'always'

      update_template # creates new template

      ct = ConfigTemplate.find_by_name(@name)
      assert_equal [@os], ct.operatingsystems
    end
  end

  def get_template(name)
    File.expand_path(File.join('..', '..', '..', 'templates', name), __FILE__)
  end

end
