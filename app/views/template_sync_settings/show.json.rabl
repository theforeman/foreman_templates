object @setting

node do |setting|
  { :name => setting.name.delete_prefix('template_sync_') }
end

attributes :id, :value, :description, :settings_type, :default, :full_name

node do |setting|
  { :selection => (setting.select_values || {}).map { |key, label| { value: key, label: label } } }
end
