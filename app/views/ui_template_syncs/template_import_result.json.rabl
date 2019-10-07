object @template_result

attributes :additional_errors, :errors, :exception_message, :name, :template_file, :additional_info

node(false) do |result|
  partial "ui_template_syncs/template_attrs", :object => result.template
end
