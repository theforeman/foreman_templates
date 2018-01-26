object @template_result

attributes :additional_errors, :errors, :exception_message, :name

node(false) do |result|
  partial "template_syncs/template_attrs", :object => result.template
end
