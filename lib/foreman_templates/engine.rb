require 'fileutils'
require 'yaml'
require 'diffy'
require 'git'

module ForemanTemplates
  # Inherit from the Rails module of the parent app (Foreman), not the plugin.
  # Thus, inhereits from ::Rails::Engine and not from Rails::Engine
  class Engine < ::Rails::Engine
    engine_name 'foreman_templates'

    initializer 'foreman_templates.load_default_settings', :before => :load_config_initializers do
      require_dependency File.expand_path('../../../app/models/setting/template_sync.rb', __FILE__) if (Setting.table_exists? rescue(false))
    end

    initializer 'foreman_templates.register_plugin', :before => :finisher_hook do
      Foreman::Plugin.register :foreman_templates do
        requires_foreman '>= 1.12'
      end
    end

    config.to_prepare do
      begin
        Template.send(:include, ForemanTemplates::TemplateImport)
        Ptable.send(:include, ForemanTemplates::PtableImport)
        ProvisioningTemplate.send(:include, ForemanTemplates::ProvisioningTemplateImport)
      rescue => e
        puts "#{ForemanTemplates::ENGINE_NAME}: skipping engine hook (#{e})"
      end
    end
  end
end
