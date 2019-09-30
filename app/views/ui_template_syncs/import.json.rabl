object @parse_result

attributes :repo, :branch

node(:result_action) { 'import' }

child :results => :templates do
  extends 'ui_template_syncs/template_import_results'
end
