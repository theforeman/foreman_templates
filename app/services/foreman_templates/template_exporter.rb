module ForemanTemplates
  class TemplateExporter < Action
    def self.setting_overrides
      %i(prefix dirname filter repo negate branch metadata_export_mode)
    end

    def export!
      @dir = Dir.mktmpdir

      git_repo = Git.clone(@repo, @dir)
      logger.debug "cloned #{@repo} to #{@dir}"
      branch = @branch ? @branch : get_default_branch(git_repo)
      git_repo.checkout(branch) if branch

      dump_files!

      git_repo.add
      logger.debug "commiting changes in cloned repo"
      git_repo.commit "Templates export made by Foreman user #{User.current.try(:login) || User::ANONYMOUS_ADMIN}"
      logger.debug "pushing to branch #{branch} at origin #{@repo}"
      git_repo.push 'origin', branch

      return true
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
      prefix.to_s + template.name.downcase.tr(' ', '_') + '.erb'
    end

    def get_dump_dir(template)
      kind = template.respond_to?(:template_kind) ? template.template_kind.try(:name) || 'snippet' : nil
      File.join(@dir, dirname.to_s, template.model_name.human.pluralize.downcase.tr(' ', '_'), kind.to_s)
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
