object @template

attributes :name

node(false) do |template|
  partial "ui_template_syncs/template_attrs", :object => template
end
