require 'fileutils'
require 'yaml'
require 'diffy'
require 'git'
require 'rabl'

module ForemanTemplates
  # Inherit from the Rails module of the parent app (Foreman), not the plugin.
  # Thus, inhereits from ::Rails::Engine and not from Rails::Engine
  class Engine < ::Rails::Engine
    engine_name 'foreman_templates'

    initializer "foreman_templates.add_rabl_view_path" do
      Rabl.configure do |config|
        config.view_paths << ForemanTemplates::Engine.root.join('app', 'views')
      end
    end

    initializer "foreman_templates.load_app_instance_data" do |app|
      ForemanTemplates::Engine.paths['db/migrate'].existent.each do |path|
        app.config.paths['db/migrate'] << path
      end
    end

    initializer 'foreman_templates.register_plugin', :before => :finisher_hook do
      Foreman::Plugin.register :foreman_templates do
        requires_foreman '>= 3.7'
        register_gettext

        apipie_documented_controllers ["#{ForemanTemplates::Engine.root}/app/controllers/api/v2/*.rb"]

        settings do
          category(:template_sync, N_('Template Sync')) do
            setting('template_sync_verbose',
              type: :boolean,
              description: N_('Choose verbosity for Rake task importing templates'),
              default: false,
              full_name: N_('Verbosity'))
            setting('template_sync_associate',
              type: :string,
              description: N_('Associate templates to OS, organization and location'),
              default: 'new',
              full_name: N_('Associate'),
              collection: -> { ForemanTemplates.associate_types })
            setting('template_sync_prefix',
              type: :string,
              description: N_('The string that will be added as prefix to imported templates'),
              default: "",
              full_name: N_('Prefix'))
            setting('template_sync_dirname',
              type: :string,
              description: N_('The directory within the Git repo containing the templates'),
              default: '/',
              full_name: N_('Dirname'))
            setting('template_sync_filter',
              type: :string,
              description: N_('Import/export names matching this regex (case-insensitive; snippets are not filtered)'),
              default: '',
              full_name: N_('Filter'))
            setting('template_sync_repo',
              type: :string,
              description: N_('Target path to import/export. Different protocols can be used, for example /tmp/dir, git://example.com, https://example.com, ssh://example.com. When exporting to /tmp, note that production deployments may be configured to use private tmp.'),
              default: 'https://github.com/theforeman/community-templates.git',
              full_name: N_('Repo'))
            setting('template_sync_negate',
              type: :boolean,
              description: N_('Negate the filter for import/export'),
              default: false,
              full_name: N_('Negate'))
            setting('template_sync_branch',
              type: :string,
              description: N_('Default branch in Git repo'),
              default: '',
              full_name: N_('Branch'))
            setting('template_sync_metadata_export_mode',
              type: :string,
              description: N_('Default metadata export mode, refresh re-renders metadata, keep will keep existing metadata, remove exports template without metadata'),
              default: 'refresh',
              full_name: N_('Metadata export mode'),
              collection: -> { ForemanTemplates.metadata_export_mode_types })
            setting('template_sync_force',
              type: :boolean,
              description: N_('Should importing overwrite locked templates?'),
              default: false,
              full_name: N_('Force import'))
            setting('template_sync_lock',
              type: :string,
              description: N_('How to handle lock for imported templates?'),
              default: 'keep',
              full_name: N_('Lock templates'),
              collection: -> { ForemanTemplates.lock_types })
            setting('template_sync_commit_msg',
              type: :string,
              description: N_('Custom commit message for templates export'),
              default: 'Templates export made by a Foreman user',
              full_name: N_('Commit message'))
          end
        end

        security_block :templates do
          permission :import_templates, {
            :"api/v2/template" => [:import],
            :ui_template_syncs => [:import]
          }, :resource_type => 'Template'
          permission :export_templates, {
            :"api/v2/template" => [:export],
            :ui_template_syncs => [:export]
          }, :resource_type => 'Template'
          permission :view_template_syncs, {
            :ui_template_syncs => [:sync_settings],
            :template_syncs => [:index]
          }, :resource_type => 'Template'
        end
        add_all_permissions_to_default_roles

        menu :top_menu, :template_sync,
          :url_hash => { :controller => :template_syncs, :action => :index },
          :caption => N_('Sync Templates'),
          :parent => :hosts_menu,
          :before => :ptables,
          :turbolinks => false
      end
    end

    config.to_prepare do
      Setting::NOT_STRIPPED << 'template_sync_prefix'

      Template.include ForemanTemplates::TemplateExtensions
    end
  end
end
