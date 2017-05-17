require 'test_plugin_helper'

module Api
  module V2
    class TemplateControllerTest < ::ActionController::TestCase
      test "should import from git" do
        post :import, 'repo' => "#{ForemanTemplates::Engine.root}/test/templates/core", 'prefix' => ''
        assert_response :success
      end
    end
  end
end
