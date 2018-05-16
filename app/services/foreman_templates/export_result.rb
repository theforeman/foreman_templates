module ForemanTemplates
  class ExportResult
    attr_accessor :exported, :error, :warning

    def initialize(repo, branch, git_user)
      @repo = repo
      @branch = branch
      @git_user = git_user
      @error = nil
      @warning = nil
      @templates = []
      @exported = false
    end

    def add_exported_templates(templates)
      @templates.concat templates
    end

    def to_h
      { :error => @error,
        :warning => @warning,
        :repo => @repo,
        :branch => @branch,
        :git_user => @git_user,
        :templates => dumped_files_result }
    end

    private

    def dumped_files_result
      @templates.map { |template| to_template_h template }
    end

    def to_template_h(template)
      { :id => template.id,
        :name => template.name,
        :exported => @exported,
        :type => template.class.name.underscore }
    end
  end
end
