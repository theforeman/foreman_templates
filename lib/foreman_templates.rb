module ForemanTemplates
  if defined?(Rails) && Rails::VERSION::MAJOR == 3
    require 'foreman_templates/engine'
  end
end
