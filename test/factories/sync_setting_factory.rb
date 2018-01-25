FactoryBot.define do
  factory :template_sync_setting, :class => ::Setting::TemplateSync do
    name "template_sync_empty"
    value "random"
    description "some text"
    category "Setting::TemplateSync"
    default "random"
    full_name "Empty"
    encrypted false
  end
end
