require 'test_plugin_helper'

module ForemanTemplates
  class ActionTest < ActiveSupport::TestCase
    context 'initialization of action' do
      test '#initialize loads data from settings' do
        ::Setting.stubs(:[]).returns('/tmp')
        ForemanTemplates::Action.stubs(:setting_overrides).returns([ :directory ])
        action = ForemanTemplates::Action.new
        assert_equal '/tmp', action.instance_variable_get('@directory')
      end

      test '#initialize can be overriden by specific value' do
        ::Setting.stubs(:[]).returns('/tmp')
        ForemanTemplates::Action.stubs(:setting_overrides).returns([ :directory ])
        action = ForemanTemplates::Action.new :directory => '/var/tmp'
        assert_equal '/var/tmp', action.instance_variable_get('@directory')
      end
    end

    test 'defines logger' do
      Action.new.respond_to?(:logger)
    end

    context 'git_repo?' do
      test 'it returns false for absolute path' do
        refute Action.new(:repo => '/tmp').git_repo?
      end

      test 'it returns false for user home path' do
        refute Action.new(:repo => '~user').git_repo?
      end

      test 'it return false for relative path' do
        refute Action.new(:repo => 'tmp/').git_repo?
      end

      test 'it returns true for http url' do
        assert Action.new(:repo => 'http://github.com').git_repo?
      end

      test 'it returns true for https url' do
        assert Action.new(:repo => 'https://github.com').git_repo?
      end

      test 'it returns true for git url' do
        assert Action.new(:repo => 'git://github.com').git_repo?
      end

      test 'it returns true for git+ssh url' do
        assert Action.new(:repo => 'git://github.com').git_repo?
      end

      test 'it returns true for ssh+git url' do
        assert Action.new(:repo => 'ssh+git://github.com').git_repo?
      end

      test 'it returns true for ssh url' do
        assert Action.new(:repo => 'ssh://github.com').git_repo?
      end
    end

    context 'get_absolute_path' do
      test 'it keeps absolute paths' do
        assert_equal Action.new(:repo => '/tmp').get_absolute_repo_path, '/tmp'
      end

      test 'it converts relative path to absolute' do
        assert_equal '/', Action.new(:repo => 'tmp').get_absolute_repo_path.first
      end
    end

    context 'verify_path!' do
      test 'raises an exception if the path does not exists' do
        assert_raises ForemanTemplates::PathAccessException do
          Action.new.verify_path!('/tmpfoobar')
        end
      end

      test 'does not raise anything if the directory exist' do
        Dir.mktmpdir do |dir|
          assert_nothing_raised do
            Action.new.verify_path!(dir)
          end
        end
      end
    end
  end
end
