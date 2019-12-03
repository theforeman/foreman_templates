class Setting
  class TemplateSync < ::Setting
    self.include_root_in_json = false

    def self.common_stripped_names
      %w(verbose repo branch dir filter negate)
    end

    def self.import_stripped_names
      %w(prefix associate force lock)
    end

    def self.export_stripped_names
      %w(metadata_export_mode)
    end

    def self.import_setting_names(except = [])
      map_prefix omit_settings(common_stripped_names + import_stripped_names, except)
    end

    def self.export_setting_names(except = [])
      map_prefix omit_settings(common_stripped_names + export_stripped_names, except)
    end

    def self.map_prefix(stripped_names)
      stripped_names.map { |item| "template_sync_#{item}" }
    end

    def self.omit_settings(setting_names, except_array)
      setting_names.reject { |name| except_array.include? name }
    end

    def self.associate_types
      {
        'always' => _('Always'),
        'new' => _('New'),
        'never' => _('Never')
      }
    end

    def self.metadata_export_mode_types
      {
        'refresh' => _('Refresh'),
        'keep' => _('Keep'),
        'remove' => _('Remove')
      }
    end

    def short_name
      name.split('template_sync_').last
    end

    def selection
      selection_method = name.split('template_sync_').last.concat('_types')
      return transformed_selection(selection_method) if self.class.respond_to?(selection_method)

      []
    end

    def self.load_defaults
      return unless super

      %w(template_sync_filter template_sync_branch template_sync_prefix).each { |s| Setting::BLANK_ATTRS << s }
      Setting::NOT_STRIPPED << 'template_sync_prefix'

      self.transaction do
        [
          self.set('template_sync_verbose', N_('Choose verbosity for Rake task importing templates'), false, N_('Verbosity')),
          self.set('template_sync_associate', N_('Associate templates to OS, organization and location'), 'new', N_('Associate'), nil, { :collection => Proc.new { self.associate_types } }),
          self.set('template_sync_prefix', N_('The string all imported templates should begin with'), "", N_('Prefix')),
          self.set('template_sync_dirname', N_('The directory within the Git repo containing the templates'), '/', N_('Dirname')),
          self.set('template_sync_filter', N_('Import or export names matching this regex (case-insensitive; snippets are not filtered)'), '', N_('Filter')),
          self.set('template_sync_repo', N_('Target path to import and export. Different protocols can be used, e.g. /tmp/dir, git://example.com, https://example.com, ssh://example.com'), 'https://github.com/theforeman/community-templates.git', N_('Repo')),
          self.set('template_sync_negate', N_('Negate the prefix (for purging) / filter (for importing/exporting)'), false, N_('Negate')),
          self.set('template_sync_branch', N_('Default branch in Git repo'), '', N_('Branch')),
          self.set('template_sync_metadata_export_mode', N_('Default metadata export mode, refresh re-renders metadata, keep will keep existing metadata, remove exports template without metadata'), 'refresh', N_('Metadata export mode'), nil, { :collection => Proc.new { self.metadata_export_mode_types } }),
          self.set('template_sync_force', N_('Should importing overwrite locked templates?'), false, N_('Force import')),
          self.set('template_sync_lock', N_('Should importing lock templates?'), false, N_('Lock templates')),
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

    private

    def transformed_selection(selection_method)
      self.class.public_send(selection_method).map { |key, translated| { :value => key, :label => translated } }
    end
  end
end
