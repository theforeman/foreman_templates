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
      template_class_dir = template.model_name.plural
      template_class_dir = 'partition_tables_templates' if template_class_dir == 'ptables'
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

    # * refresh - template.to_erb stripping existing metadata,
    # * remove  - just template.template with stripping existing metadata,
    # * keep    - taking the whole template.template
    def export_method
      case @metadata_export_mode
        when 'refresh'
          :to_erb
        when 'remove'
          :template_without_metadata
        # TODO separate commit, requires Foreman 1.19 if core metadata separation gets merged
        when 'keep'
          :template_with_imported_metadata
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
