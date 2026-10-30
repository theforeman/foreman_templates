require 'test_plugin_helper'

module ForemanTemplates
  class DiffPreviewTest < ActiveSupport::TestCase
    setup do
      @repo_dir = Dir.mktmpdir
      @git = Git.init(@repo_dir)
      @git.config('user.name', 'Foreman Templates tests')
      @git.config('user.email', 'foreman-templates@example.test')

      write_file('templates/test.erb', "old template\n")
      write_file('README.md', "old readme\n")
      @git.add
      @git.commit('initial content')
      @base_branch = @git.current_branch

      @git.branch('candidate').checkout
      write_file('templates/test.erb', "new template\n")
      write_file('README.md', "new readme\n")
      @git.add
      @git.commit('updated content')
    end

    teardown do
      FileUtils.remove_entry_secure(@repo_dir) if File.exist?(@repo_dir)
    end

    test 'previews changes between local branches' do
      result = preview

      assert_equal @base_branch, result[:base_branch]
      assert_equal 'candidate', result[:branch]
      assert_includes result[:diff], '-old template'
      assert_includes result[:diff], '+new template'
      refute_includes result[:diff], 'README.md'
      refute result[:truncated]
    end

    test 'returns an empty diff for matching branches' do
      result = preview(:branch => @base_branch)

      assert_empty result[:diff]
      refute result[:truncated]
    end

    test 'rejects an invalid branch name' do
      error = assert_raises(::Foreman::Exception) do
        preview(:branch => '--output=/tmp/diff')
      end

      assert_includes error.message, "Invalid Git branch in parameter 'branch'"
    end

    test 'rejects a missing branch' do
      error = assert_raises(::Foreman::Exception) do
        preview(:branch => 'missing')
      end

      assert_includes error.message, "Branch 'missing' was not found in the repository"
    end

    private

    def preview(overrides = {})
      DiffPreview.new({
        :repo => @repo_dir,
        :base_branch => @base_branch,
        :branch => 'candidate',
        :dirname => '/templates'
      }.merge(overrides)).preview!
    end

    def write_file(path, contents)
      absolute_path = File.join(@repo_dir, path)
      FileUtils.mkdir_p(File.dirname(absolute_path))
      File.write(absolute_path, contents)
    end
  end
end
