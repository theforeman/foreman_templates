require 'foreman_templates/engine'

module ForemanTemplates
  BASE_SETTING_NAMES = %w(repo branch dirname filter negate).freeze
  IMPORT_SETTING_NAMES = (BASE_SETTING_NAMES | %w(prefix associate force lock)).freeze
  EXPORT_SETTING_NAMES = (BASE_SETTING_NAMES | %w(metadata_export_mode commit_msg)).freeze

  def self.associate_types
    { 'always' => _('Always'), 'new' => _('New'), 'never' => _('Never') }
  end

  def self.lock_types
    { 'lock' => _('Lock'), 'keep_lock_new' => _('Keep, lock new'), 'keep' => _('Keep, do not lock new'), 'unlock' => _('Unlock') }
  end

  def self.metadata_export_mode_types
    { 'refresh' => _('Refresh'), 'keep' => _('Keep'), 'remove' => _('Remove') }
  end
end
