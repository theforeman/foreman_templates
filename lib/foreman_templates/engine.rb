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

    initializer 'foreman_templates.load_default_settings', :before => :load_config_initializers do
      require_dependency File.expand_path('../../app/models/setting/template_sync.rb', __dir__) if (Setting.table_exists? rescue(false))
    end

    initializer "foreman_templates.add_rabl_view_path" do
      Rabl.configure do |config|
        config.view_paths << ForemanTemplates::Engine.root.join('app', 'views')
      end
    end

    initializer 'foreman_templates.register_plugin', :before => :finisher_hook do
      Foreman::Plugin.register :foreman_templates do
        requires_foreman '>= 1.23'

        apipie_documented_controllers ["#{ForemanTemplates::Engine.root}/app/controllers/api/v2/*.rb"]

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
  end
end
