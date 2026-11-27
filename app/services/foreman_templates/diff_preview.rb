module ForemanTemplates
  class DiffPreview < Action
    MAX_DIFF_SIZE = 1_048_576
    INVALID_REF_CHARACTERS = /[\x00-\x20~^:?*\[\\]/.freeze

    attr_reader :base_branch

    def initialize(args = {})
      @base_branch = args[:base_branch]
      super
    end

    def preview!
      validate_branch!(@base_branch, 'base_branch')
      validate_branch!(@branch, 'branch')

      git_repo? ? preview_remote_repo : preview_local_repo
    end

    private

    def preview_remote_repo
      @dir = Dir.mktmpdir
      git_repo = init_git_repo
      git_repo.fetch
      build_preview(git_repo, true)
    ensure
      FileUtils.remove_entry_secure(@dir) if @dir && File.exist?(@dir)
    end

    def preview_local_repo
      @dir = get_absolute_repo_path
      verify_path!(@dir)
      build_preview(Git.open(@dir), false)
    end

    def build_preview(git_repo, remote)
      ensure_branch_exists!(git_repo, @base_branch, remote)
      ensure_branch_exists!(git_repo, @branch, remote)

      diff = git_repo.diff(branch_ref(@base_branch, remote), branch_ref(@branch, remote))
      diff = diff.path(normalized_dirname) if normalized_dirname.present?
      patch = utf8_patch(diff.patch)
      truncated = patch.bytesize > MAX_DIFF_SIZE
      patch = patch.byteslice(0, MAX_DIFF_SIZE).to_s.scrub if truncated

      {
        :repo => redacted_repo,
        :base_branch => @base_branch,
        :branch => @branch,
        :diff => patch,
        :truncated => truncated
      }
    end

    def normalized_dirname
      @normalized_dirname ||= @dirname.to_s.sub(%r{\A/+}, '').presence
    end

    def branch_ref(branch, remote)
      remote ? "origin/#{branch}" : branch
    end

    def ensure_branch_exists!(git_repo, branch, remote)
      exists = remote ? git_repo.is_remote_branch?(branch) : git_repo.is_branch?(branch)
      return if exists

      raise ::Foreman::Exception.new(N_("Branch '%s' was not found in the repository"), branch)
    end

    def validate_branch!(branch, parameter)
      return if valid_branch?(branch)

      raise ::Foreman::Exception.new(N_("Invalid Git branch in parameter '%s'"), parameter)
    end

    def valid_branch?(branch)
      branch.present? && branch.bytesize <= 255 &&
        !branch.start_with?('-') && !branch.end_with?('/', '.', '.lock') &&
        !branch.include?('..') && !branch.include?('@{') && !branch.include?('//') &&
        !branch.match?(INVALID_REF_CHARACTERS)
    end

    def utf8_patch(patch)
      patch.to_s.encode(Encoding::UTF_8, :invalid => :replace, :undef => :replace, :replace => "\uFFFD")
    end

    def redacted_repo
      uri = URI(@repo)
      uri.password = '*****' if uri.password
      uri.to_s
    rescue URI::InvalidURIError
      @repo
    end
  end
end
