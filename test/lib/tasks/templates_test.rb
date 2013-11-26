require 'test_plugin_helper'
require 'rake'
require 'rake/testtask'

class PluginTemplateTest < ActiveSupport::TestCase
  setup do
    # Checkout the plugin tests as a source of templates
    # Caveat: changes to /test/templates will need to be committed for tests to work
    #ENV['repo']    = 'https://github.com/GregSutcliffe/foreman_templates.git'
    ENV['repo']    = '/home/greg/github/foreman_templates'
    ENV['prefix']  = 'FooBar'
    ENV['dirname'] = '/test/templates'
    ENV['verbose'] = 'false'

    # Load the task
    Rake.application.rake_require 'templates'
    Rake::Task.define_task(:environment)
    Rake::Task['templates:sync'].reenable

    # Need to be admin to create templates
    User.current = User.admin
  end

  test 'map_oses returns OSes that are in the db' do
    @metadata = {}
    @metadata['oses'] = ['centos 5.3', 'Fedora 19']
    assert_equal 1, map_oses.size
    assert_equal Operatingsystem.find_by_fullname('centos 5.3').id, map_oses.first.id
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
    assert_equal Operatingsystem.find_by_fullname('Ubuntu 10.10').id, ct.operatingsystems.first.id

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

  def get_template(name)
    File.expand_path(File.join('..', '..', '..', 'templates', name), __FILE__)
  end

end
