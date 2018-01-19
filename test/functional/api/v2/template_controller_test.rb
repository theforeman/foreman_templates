require 'test_plugin_helper'

module Api
  module V2
    class TemplateControllerTest < ::ActionController::TestCase
      test "should import from git" do
        post :import, params: { 'repo' => "#{ForemanTemplates::Engine.root}/test/templates/core", 'prefix' => '' }
        assert_response :success
      end

      test "should export to filesystem" do
        Dir.mktmpdir do |tmpdir|
          post :export, params: { 'repo' => tmpdir, 'metadata_export_mode' => 'keep' }
          assert_response :success
          assert(Dir.entries(tmpdir).size >= 2)
        end
      end

      test "should not export filtered template" do
        Dir.mktmpdir do |tmpdir|
          FactoryBot.create(:provisioning_template, :name => 'export_test_template')
          post :export, params: { "repo" => tmpdir, "filter" => "^export_test_template", "negate" => true, "metadata_export_mode" => "keep" }
          assert_response :success
          refute Dir.entries("#{tmpdir}/provisioning_templates/provision").include?('export_test_template.erb')
        end
      end

      test "should purge templates" do
        FactoryBot.create(:provisioning_template, :name => "Community test template")
        post :purge, params: { "prefix" => "Community" }
        assert_response :success
        refute ProvisioningTemplate.find_by(:name => "Community test template")
      end
    end
  end
end
