module ForemanTemplates
  #Inherit from the Rails module of the parent app (Foreman), not the plugin.
  #Thus, inhereits from ::Rails::Engine and not from Rails::Engine
  class Engine < ::Rails::Engine

    rake_tasks do
      load "templates.rake"
    end

  end
end
