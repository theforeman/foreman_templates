object false

node(:apiUrls) do
  {
    exportUrl: export_ui_template_syncs_path,
    syncSettingsUrl: sync_settings_ui_template_syncs_path,
    importUrl: import_ui_template_syncs_path
  }
end

node(:validationData) do
  { repo: ::ForemanTemplates::Action.repo_start_with }
end

node(:editPaths) { @edit_paths }
node(:fileRepoStartWith) { ::ForemanTemplates::Action.file_repo_start_with }
node(:userPermissions) do
  {
    import: authorized_for(controller: :ui_template_syncs, action: :import),
    export: authorized_for(controller: :ui_template_syncs, action: :export)
  }
end

child @settings => :settings do
  child :import => :import do
    extends "template_sync_settings/show"
  end

  child :export => :export do
    extends "template_sync_settings/show"
  end
end
