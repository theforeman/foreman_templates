module ForemanTemplates
  #Inherit from the Rails module of the parent app (Foreman), not the plugin.
  #Thus, inhereits from ::Rails::Engine and not from Rails::Engine
  class Engine < ::Rails::Engine
    engine_name 'foreman_templates'

    initializer 'foreman_templates.register_plugin', :before => :finisher_hook do |app|
      Foreman::Plugin.register :foreman_templates do
        requires_foreman '>= 1.12'
      end
    end

  end
end
