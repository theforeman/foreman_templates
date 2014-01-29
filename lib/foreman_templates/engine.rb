require 'diffy'

module ForemanTemplates
  #Inherit from the Rails module of the parent app (Foreman), not the plugin.
  #Thus, inhereits from ::Rails::Engine and not from Rails::Engine
  class Engine < ::Rails::Engine

    initializer 'foreman_templates.register_plugin', :after=> :finisher_hook do |app|
      Foreman::Plugin.register :foreman_templates do
      end if (Rails.env == "development" or defined? Foreman::Plugin)
    end

    rake_tasks do
      load "templates.rake"
    end

  end
end
