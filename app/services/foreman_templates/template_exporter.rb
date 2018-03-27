require 'shellwords'

module ForemanTemplates
  class TemplateExporter < Action
    def self.setting_overrides
      super + %i(metadata_export_mode)
    end

    def export!
      @export_result = ExportResult.new(@repo, @branch, foreman_git_user)
      if git_repo?
        export_to_git
      else
        export_to_files
      end

      return @export_result
    end

    def export_to_files
      @dir = get_absolute_repo_path
      verify_path!(@dir)
      dump_files!
      @export_result.exported = true
    end

    def export_to_git
      @dir = Dir.mktmpdir
      return @export_result if branch_missing?
      git_repo = Git.clone(@repo, @dir)
      logger.debug "cloned #{@repo} to #{@dir}"

      setup_git_branch git_repo
      dump_files!
      git_repo.add

      status = git_repo.status
      if status.added.any? || status.changed.any? || status.deleted.any? || status.untracked.any?
        git_repo.commit "Templates export made by Foreman user #{foreman_git_user}"
        git_repo.push 'origin', branch
        @export_result.exported = true
      else
        @export_result.warning = 'No change detected, skipping the commit and push'
      end
    rescue StandardError => e
      @export_result.error = e.message
    ensure
      FileUtils.remove_entry_secure(@dir) if File.exist?(@dir)
      @export_result
    end

    def setup_git_branch(git_repo)
      if git_repo.is_branch?(@branch)
        git_repo.checkout(@branch)
      else
        git_repo.branch(@branch).checkout
        if git_repo.is_remote_branch?(@branch) # if we work with remote branch we need to sync it first
          git_repo.reset_hard("origin/#{@branch}")
        end
      end
    end

    def foreman_git_user
      User.current.try(:login) || User::ANONYMOUS_ADMIN
    end

    def dump_files!
      templates = templates_to_dump
      templates.map do |template|
        current_dir = get_dump_dir(template)
        FileUtils.mkdir_p current_dir
        filename = File.join(current_dir, get_template_filename(template))
        File.open(filename, 'w+') do |file|
          logger.debug "Writing to file #{filename}"
          bytes = file.write template.public_send(export_method)
          logger.debug "finished writing #{bytes}"
        end
      end
      @export_result.add_exported_templates templates
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
      base = find_templates
      if filter.present?
        method = negate ? :reject : :select
        base.public_send(method) { |template| template.name.match(/#{filter}/i) }
      else
        base
      end
    end

    def branch_missing?
      if @branch.blank?
        @export_result.error = "Please specify a branch when exporting into a git repo"
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

    private

    def find_templates
      @taxonomies.values.all?(&:empty?) ? Template.all : find_taxed_templates
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
      Template.where(:id => TaxableTaxonomy.where(:taxonomy_id => tax_ids,
                                                  :taxable_type => Template.subclasses.map(&:name)).pluck(:taxable_id))
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
