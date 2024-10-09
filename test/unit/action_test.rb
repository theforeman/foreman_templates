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

    context 'sync through http_proxy' do
      before do
        @template_sync_service = Action.new(:repo => 'https://github.com/theforeman/community-templates.git')
      end

      test 'should sync through custom http proxy' do
        proxy = FactoryBot.create(:http_proxy)
        @template_sync_service.instance_variable_set(:@http_proxy_policy, 'selected')
        @template_sync_service.instance_variable_set(:@http_proxy_id, proxy.id)
        assert_equal proxy.full_url, show_repo_proxy_url
      end

      test 'sync should fail if invalid http proxy id is provided' do
        @template_sync_service.instance_variable_set(:@http_proxy_policy, 'selected')
        @template_sync_service.instance_variable_set(:@http_proxy_id, 'invalid ID')
        assert_raises(ActiveRecord::RecordNotFound) do
          @template_sync_service.send(:init_git_repo)
        end
      end

      test 'should sync through https proxy using custom CA certificate' do
        custom_cert = 'Custom proxy CA cert'
        proxy = FactoryBot.create(:http_proxy, :cacert => custom_cert, :url => 'https://localhost:8888')
        @template_sync_service.instance_variable_set(:@http_proxy_policy, 'selected')
        @template_sync_service.instance_variable_set(:@http_proxy_id, proxy.id)
        assert_equal custom_cert, show_repo_proxy_cert
      end

      test 'should sync through global http proxy' do
        Setting[:http_proxy] = 'https://localhost:8888'
        @template_sync_service.instance_variable_set(:@http_proxy_policy, 'global')
        assert_equal Setting[:http_proxy], show_repo_proxy_url
      end

      test 'should sync without using http proxy if global proxy is not set' do
        Setting[:http_proxy] = ""
        @template_sync_service.instance_variable_set(:@http_proxy_policy, 'global')
        assert_nil show_repo_proxy_url
      end

      test 'should sync without using http proxy' do
        @template_sync_service.instance_variable_set(:@http_proxy_policy, 'none')
        assert_nil show_repo_proxy_url
      end

      private

      def show_repo_proxy_url
        dir = Dir.mktmpdir
        @template_sync_service.instance_variable_set(:@dir, dir)
        begin
          repo = @template_sync_service.send(:init_git_repo)
          repo.config.to_h['http.proxy']
        ensure
          FileUtils.remove_entry_secure(dir) if File.exist?(dir)
        end
      end

      def show_repo_proxy_cert
        dir = Dir.mktmpdir
        @template_sync_service.instance_variable_set(:@dir, dir)
        begin
          repo = @template_sync_service.send(:init_git_repo)
          File.read(repo.config('http.proxysslcainfo'))
        ensure
          FileUtils.remove_entry_secure(dir) if File.exist?(dir)
        end
      end
    end
  end
end
