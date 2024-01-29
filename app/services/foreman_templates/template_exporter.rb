module ForemanTemplates
  class TemplateExporter < Action
    def self.setting_overrides
      super + %i(metadata_export_mode commit_msg)
    end

    def initialize(args = {})
      super args
      @result_lines = []
      @uri = URI(@repo)
      @redacted_uri = @uri.dup
      @redacted_uri.password = '*****' if @uri.password
    end

    def export!
      if git_repo?
        export_to_git
      else
        export_to_files
      end
      export_result
    end

    def export_to_files
      @dir = get_absolute_repo_path
      verify_path!(@dir)
      dump_files!
    end

    def export_to_git
      @dir = Dir.mktmpdir
      return if branch_missing?

      git_repo = Git.clone(@repo, @dir)
      logger.debug "cloned '#{@repo}' to '#{@dir}'"

      setup_git_branch git_repo
      dump_files!
      git_repo.add

      new_repo = false
      begin
        status = git_repo.status
      rescue Git::GitExecuteError # no HEAD for repo without commits, git diff-index HEAD fails
        new_repo = true
      end
      if new_repo || status.added.any? || status.changed.any? || status.deleted.any? || status.untracked.any?
        git_repo.commit commit_msg
        git_repo.push 'origin', branch
      else
        @warning = 'No change detected, skipping the commit and push'
      end
    rescue StandardError => e
      @error = if @uri.password
                 e.message.gsub(@uri.to_s, @redacted_uri.to_s)
               else
                 e.message
               end
    ensure
      FileUtils.remove_entry_secure(@dir) if File.exist?(@dir)
    end

    def setup_git_branch(git_repo)
      logger.debug "checking out branch '#{@branch}'"
      if git_repo.is_branch?(@branch) # local branch
        git_repo.checkout(@branch)
      elsif git_repo.is_remote_branch?(@branch) # if we work with remote branch, checkout and sync
        git_repo.branch(@branch).checkout
        git_repo.reset_hard("origin/#{@branch}")
      else # neither local nor remote
        git_repo.checkout(@branch, :new_branch => true)
      end
    end

    def foreman_git_user
      User.current.try(:login) || User::ANONYMOUS_ADMIN
    end

    def dump_files!
      templates_to_dump.map do |template|
        current_dir = get_dump_dir(template)
        FileUtils.mkdir_p current_dir
        filename = File.join(current_dir, template.template_file)
        File.open(filename, 'w+') do |file|
          logger.debug "Writing to file #{filename}"
          bytes = file.write template.public_send(export_method)
          logger.debug "finished writing #{bytes}"
        end
      end
    rescue StandardError => e
      raise PathAccessException, e.message
    end

    def get_dump_dir(template)
      kind = template.respond_to?(:template_kind) ? template.template_kind.try(:name) || 'snippet' : nil
      template_class_dir = template.model_name.plural
      template_class_dir = 'partition_tables_templates' if template_class_dir == 'ptables'
      File.join(@dir, dirname.to_s, template_class_dir, kind.to_s)
    end

    def templates_to_dump
      find_templates.each do |template|
        if filter.present?
          exportable = /#{filter}/i.match?(template.name) ? !negate : negate
          result = ExportResult.new(template, exportable)
          next @result_lines << result.matching_filter unless exportable

          @result_lines << result
        else
          @result_lines << ExportResult.new(template)
        end
      end
      @result_lines.select(&:exported).map(&:template)
    end

    def branch_missing?
      if @branch.blank?
        @error = "Please specify a branch when exporting into a git repo"
        return true
      end
      false
    end

    # * refresh - template.to_erb stripping existing metadata,
    # * remove  - just template.template with stripping existing metadata,
    # * keep    - taking the whole template.template
    def export_method
      case @metadata_export_mode
        when 'refresh'
          :to_erb
        when 'remove'
          :template_without_metadata
        when 'keep'
          :template
        else
          raise "Unknown metadata export mode #{@metadata_export_mode}"
      end
    end

    def export_result
      {
        :templates => @result_lines, :repo => @redacted_uri, :branch => @branch,
        :git_user => foreman_git_user, :error => @error, :warning => @warning
      }
    end

    private

    def find_templates
      @taxonomies.values.all?(&:empty?) ? find_all_templates : find_taxed_templates
    end

    # We have to go through subclasses because Template does not include Taxonomix
    def find_all_templates
      Template.subclasses.flat_map(&:all)
    end

    def find_taxed_templates
      location_ids = taxes_ids('location')
      organization_ids = taxes_ids('organization')
      if location_ids.empty?
        templates_query(organization_ids)
      elsif organization_ids.empty?
        templates_query(location_ids)
      else
        templates_query(organization_ids) & templates_query(location_ids)
      end
    end

    def templates_query(tax_ids)
      Template.where(:id => TaxableTaxonomy.where(
        :taxonomy_id => tax_ids,
        :taxable_type => Template.subclasses.map(&:name)
      ).pluck(:taxable_id))
    end

    def taxes_ids(tax_type)
      tax_type.capitalize.constantize
              .where(:name => @taxonomies[tax_type.pluralize.to_sym]["#{tax_type}_names".to_sym])
              .pluck(:id)
              .concat(@taxonomies[tax_type.pluralize.to_sym]["#{tax_type}_ids".to_sym] || [])
              .uniq
    end
  end
end
