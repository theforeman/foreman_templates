require 'test_plugin_helper'

module ForemanTemplates
  class ActionTest < ActiveSupport::TestCase
    context 'initialization of action' do
      test '#initialize loads data from settings' do
        Setting.stub(:[], '/tmp') do
          ForemanTemplates::Action.stub(:setting_overrides, [ :directory ]) do
            action = ForemanTemplates::Action.new
            assert_equal '/tmp', action.instance_variable_get('@directory')
          end
        end
      end

      test '#initialize can be overriden by specific value' do
        Setting.stub(:[], '/tmp') do
          ForemanTemplates::Action.stub(:setting_overrides, [ :directory ]) do
            action = ForemanTemplates::Action.new :directory => '/var/tmp'
            assert_equal '/var/tmp', action.instance_variable_get('@directory')
          end
        end
      end
    end

    test 'defines logger' do
      Action.new.respond_to?(:logger)
    end

    context 'get_default_branch' do
      setup do
        @repo = Struct.new(:branches).new([
                                            Struct.new(:name).new('0.1-stable'),
                                            Struct.new(:name).new('develop')
                                          ])
        @action = Action.new
      end

      test 'when on develop, returns develop' do
        SETTINGS[:version].stubs(:tag).returns('develop')
        assert_equal 'develop', @action.get_default_branch(@repo)
      end

      test 'when branch exists, return it' do
        SETTINGS[:version].stubs(:tag).returns('not_develop')
        SETTINGS[:version].stubs(:short).returns('0.1')
        assert_equal '0.1-stable', @action.get_default_branch(@repo)
      end

      test 'when branch does not exist, use default branch' do
        SETTINGS[:version].stubs(:tag).returns('not_develop')
        SETTINGS[:version].stubs(:short).returns('0.2')
        refute @action.get_default_branch(@repo)
      end
    end

  end
end
