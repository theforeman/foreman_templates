require 'shellwords'

module ForemanTemplates
  class TemplateExporter < Action
    def self.setting_overrides
      super + %i(metadata_export_mode)
    end

    def export!
      if git_repo?
        export_to_git
      else
        export_to_files
      end

      return true
    end

    def export_to_files
      @dir = get_absolute_repo_path
      verify_path!(@dir)
      dump_files!
    end

    def export_to_git
      @dir = Dir.mktmpdir

      git_repo = Git.clone(@repo, @dir)
      logger.debug "cloned #{@repo} to #{@dir}"
      branch = @branch ? @branch : get_default_branch(git_repo)
      # either checkout to existing or create a new one and checkout afterwards
      if branch
        if git_repo.is_branch?(branch)
          git_repo.checkout(branch)
        else
          git_repo.branch(branch).checkout
          if git_repo.is_remote_branch?(branch) # if we work with remote branch we need to sync it first
            git_repo.reset_hard("origin/#{branch}")
          end
        end
      end

      dump_files!
      git_repo.add

      status = git_repo.status
      if status.added.any? || status.changed.any? || status.deleted.any? || status.untracked.any?
        logger.debug 'committing changes in cloned repo'
        git_repo.commit "Templates export made by Foreman user #{User.current.try(:login) || User::ANONYMOUS_ADMIN}"

        logger.debug "pushing to branch #{branch} at origin #{@repo}"
        git_repo.push 'origin', branch
      else
        logger.debug 'no change detected, skipping the commit and push'
      end
    ensure
      FileUtils.remove_entry_secure(@dir) if File.exist?(@dir)
    end

    def dump_files!
      templates_to_dump.map do |template|
        current_dir = get_dump_dir(template)
        FileUtils.mkdir_p current_dir

        filename = File.join(current_dir, get_template_filename(template))
        File.open(filename, 'w+') do |file|
          logger.debug "Writing to file #{filename}"
          bytes = file.write template.public_send(export_method)
          logger.debug "finished writing #{bytes}"
        end
      end
    end

    def get_template_filename(template)
      Shellwords.escape(template.name.downcase.tr(' /', '_') + '.erb')
    end

    def get_dump_dir(template)
      kind = template.respond_to?(:template_kind) ? template.template_kind.try(:name) || 'snippet' : nil
      template_class_dir = template.model_name.human.pluralize.downcase.tr(' ', '_')
      template_class_dir += '_templates' if template_class_dir == 'partition_tables'
      File.join(@dir, dirname.to_s, template_class_dir, kind.to_s)
    end

    def templates_to_dump
      base = Template.all
      if filter.present?
        method = negate ? :reject : :select
        base.public_send(method) { |template| template.name.match(/#{filter}/i) }
      else
        base
      end
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
  end
end
