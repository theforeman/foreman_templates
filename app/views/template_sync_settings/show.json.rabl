object @setting

node do |setting|
  { :name => setting.short_name }
end

attributes :id, :value, :description, :settings_type, :default, :full_name

node do |setting|
  { :selection => (setting.select_collection&.map { |key, label| { value: key, label: label } } || []) }
end
