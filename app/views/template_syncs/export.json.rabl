object @result

attributes :repo, :branch, :git_user, :error, :warning

node(:result_action) { 'export' }

child :templates => :templates do
  extends 'template_syncs/template_export_results'
end
