object @template

attributes :id, :snippet, :locked

node(:kind) do |template|
  template.template_kind.name if template.respond_to?(:template_kind) && template.template_kind
end

node(:class_name) do |template|
  template.class.name
end

node(:humanized_class_name) do |template|
  template.class.name.underscore.split('_').map(&:capitalize).join(' ')
end

node(:can_edit) do |template|
  authorized_for(:auth_object => template, :authorizer => authorizer, :permission => "edit_#{template.class.name.underscore.pluralize}")
end
