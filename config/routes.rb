Rails.application.routes.draw do
  namespace :api, :defaults => { :format => 'json' } do
    scope "(:apiv)", :module => :v2, :defaults => { :apiv => 'v2' }, :apiv => /v1|v2/, :constraints => ApiConstraints.new(:version => 2) do
      resources :templates, :controller => :template, :only => [] do
        collection do
          post 'import'
          post 'export'
        end
      end
    end
  end
end
