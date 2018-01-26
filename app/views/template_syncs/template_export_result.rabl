object @template

attributes :name

node(false) do |template|
  partial "template_syncs/template_attrs", :object => template
end
