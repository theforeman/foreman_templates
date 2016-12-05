require 'test_plugin_helper'

class Api::V2::TemplateControllerTest < ActionController::TestCase

  test "should import from git" do
    post :import, { 'repo': "#{ForemanTemplates::Engine.root}/test/templates/core", 'prefix': ''}
    assert_response :success
  end

end
