object @template

attributes :id, :snippet, :locked

node(:kind) do |template|
  template.template_kind.name if template.respond_to?(:template_kind) && template.template_kind
end

node(:class_name) do |template|
  template.class.name.underscore.split('_').map { |part| part.capitalize }.join(' ')
end
