require 'foreman_templates/engine'

module ForemanTemplates
  BASE_SETTING_NAMES = %w(repo branch dirname filter negate).freeze
  IMPORT_SETTING_NAMES = (BASE_SETTING_NAMES | %w(prefix associate force lock)).freeze
  EXPORT_SETTING_NAMES = (BASE_SETTING_NAMES | %w(metadata_export_mode commit_msg)).freeze
end
