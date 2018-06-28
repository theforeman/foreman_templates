require 'test_plugin_helper'

class ForemanTemplatesIntegrationTest < ActionDispatch::IntegrationTest
  test 'export and import should be idempotent when keeping metadata' do
    name = 'Prefix Ptable'
    admin = users(:apiadmin)
    Dir.mktmpdir do |tmpdir|
      common_params = { "repo" => "#{template_fixtures_path}/with_prefix", "prefix" => "Prefix", "lock" => "keep" }
      # rubocop:disable Rails/HttpPositionalArguments
      post '/api/templates/import', **create_params(common_params.merge("associate" => "new"), admin, "secret")
      assert_response :success
      first_content = Template.find_by(:name => name).template
      post '/api/templates/export', **create_params(common_params.merge("repo" => tmpdir, "metadata_export_mode" => "keep"), admin, "secret")
      assert_response :success
      post '/api/templates/import', **create_params(common_params.merge("repo" => tmpdir, "associate" => "new"), admin, "secret")
      # rubocop:enable Rails/HttpPositionalArguments
      assert_response :success
      second_content = Template.find_by(:name => name).template
      assert_equal first_content, second_content
    end
  end

  def create_params(params, user, password)
    {
      params: params,
      as: :json,
      env: { 'HTTP_AUTHORIZATION' => ActionController::HttpAuthentication::Basic.encode_credentials(user.login, password) }
    }
  end
end
