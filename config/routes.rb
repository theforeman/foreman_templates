Rails.application.routes.draw do
  resources :ui_template_syncs, :only => [] do
    collection do
      get 'sync_settings'
      post 'import'
      post 'export'
      get 'sync_config'
    end
  end

  match '/template_syncs' => 'react#index', :via => [:get]
  match '/template_syncs/*page' => 'react#index', :via => [:get]

  namespace :api, :defaults => { :format => 'json' } do
    scope "(:apiv)", :module => :v2, :defaults => { :apiv => 'v2' }, :apiv => /v2/, :constraints => ApiConstraints.new(:version => 2, :default => true) do
      resources :templates, :controller => :template, :only => [] do
        collection do
          post 'import'
          post 'export'
        end
      end
    end
  end
end
