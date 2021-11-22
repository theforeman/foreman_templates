class Setting
  class TemplateSync < ::Setting
    def self.associate_types
      {
        'always' => _('Always'),
        'new' => _('New'),
        'never' => _('Never')
      }
    end

    def self.lock_types
      {
        'lock' => _('Lock'),
        'keep_lock_new' => _('Keep, lock new'),
        'keep' => _('Keep, do not lock new'),
        'unlock' => _('Unlock')
      }
    end

    def self.metadata_export_mode_types
      {
        'refresh' => _('Refresh'),
        'keep' => _('Keep'),
        'remove' => _('Remove')
      }
    end

    def self.load_defaults
      return unless super

      %w(template_sync_filter template_sync_branch template_sync_prefix).each { |s| Setting::BLANK_ATTRS << s }
      Setting::NOT_STRIPPED << 'template_sync_prefix'

      self.transaction do
        [
          self.set('template_sync_verbose', N_('Choose verbosity for Rake task importing templates'), false, N_('Verbosity')),
          self.set('template_sync_associate', N_('Associate templates to OS, organization and location'), 'new', N_('Associate'), nil, { :collection => Proc.new { self.associate_types } }),
          self.set('template_sync_prefix', N_('The string that will be added as prefix to imported templates'), "", N_('Prefix')),
          self.set('template_sync_dirname', N_('The directory within the Git repo containing the templates'), '/', N_('Dirname')),
          self.set('template_sync_filter', N_('Import/export names matching this regex (case-insensitive; snippets are not filtered)'), '', N_('Filter')),
          self.set('template_sync_repo', N_('Target path to import/export. Different protocols can be used, for example /tmp/dir, git://example.com, https://example.com, ssh://example.com. When exporting to /tmp, note that production deployments may be configured to use private tmp.'), 'https://github.com/theforeman/community-templates.git', N_('Repo')),
          self.set('template_sync_negate', N_('Negate the filter for import/export'), false, N_('Negate')),
          self.set('template_sync_branch', N_('Default branch in Git repo'), '', N_('Branch')),
          self.set('template_sync_metadata_export_mode', N_('Default metadata export mode, refresh re-renders metadata, keep will keep existing metadata, remove exports template without metadata'), 'refresh', N_('Metadata export mode'), nil, { :collection => Proc.new { self.metadata_export_mode_types } }),
          self.set('template_sync_force', N_('Should importing overwrite locked templates?'), false, N_('Force import')),
          self.set('template_sync_lock', N_('How to handle lock for imported templates?'), 'keep', N_('Lock templates'), nil, { :collection => Proc.new { self.lock_types } }),
          self.set('template_sync_commit_msg', N_('Custom commit message for templates export'), 'Templates export made by a Foreman user', N_('Commit message'))
        ].compact.each { |s| self.create! s.update(:category => "Setting::TemplateSync") }
      end

      true
    end

    def validate_template_sync_associate(record)
      values = record.class.associate_types.keys
      if record.value && !values.include?(record.value)
        record.errors[:base] << (_("template_sync_associate must be one of %s") % values.join(', '))
      end
    end

    def validate_template_sync_metadata_export_mode(record)
      values = record.class.metadata_export_mode_types.keys
      if record.value && !values.include?(record.value)
        record.errors[:base] << (_("template_sync_metadata_export_mode must be one of %s") % values.join(', '))
      end
    end
  end
end
