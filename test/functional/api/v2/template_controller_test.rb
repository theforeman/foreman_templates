require 'test_plugin_helper'

module Api
  module V2
    class TemplateControllerTest < ::ActionController::TestCase
      setup do
        @org = FactoryBot.create(:organization, :name => 'ForemanTemplatesOrg')
        @loc = FactoryBot.create(:location, :name => 'ForemanTemplatesLoc')
      end

      test "should import from git" do
        post :import, params: { 'repo' => "#{template_fixtures_path}/core", 'prefix' => '' }
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
          refute_includes(Dir.entries("#{tmpdir}/provisioning_templates/provision"), 'export_test_template.erb')
        end
      end

      test "should import filtered templates" do
        post :import, params: {
          "repo" => "#{template_fixtures_path}/core",
          "filter" => 'filter1',
          "prefix" => "filtTemp_",
          "associate" => "new",
          "lock" => "lock",
        }
        assert_response :success
        templates = JSON.parse(@response.body)['message']['templates']
        templates.each do |template|
          if template['name'] == 'filtTemp_filter1 template'
            assert template['imported']
          end
        end
      end

      test "should not import negate filtered templates" do
        post :import, params: { "repo" => "#{template_fixtures_path}/core", "filter" => 'filter1', "prefix" => '', "negate" => true }
        assert_response :success
        templates = JSON.parse(@response.body)['message']['templates']
        templates.each do |template|
          if template['name'] == 'filter1 template'
            assert_not template['imported']
          end
        end
      end

      test "should not update locked template on import" do
        import_params = {
          :repo => "#{template_fixtures_path}/locking/core_initial",
          :prefix => '',
          :associate => "new",
          :lock => 'lock'
        }

        ForemanTemplates::TemplateImporter.new(import_params).import!
        post :import, params: import_params.merge(:repo => "#{template_fixtures_path}/locking/core_updated")
        assert_response :success
        templates = JSON.parse(@response.body)['message']['templates']
        templates.each do |template|
          assert template
          assert_not template['imported']
          assert template['changed']
          assert_equal "This template is locked. Please clone it to a new template to customize.", template['validation_errors']['base']
        end
      end

      test "should not update locked template on import with legacy lock" do
        import_params = {
          :repo => "#{template_fixtures_path}/locking/core_initial",
          :prefix => '',
          :associate => "new",
          :lock => "lock",
        }

        ForemanTemplates::TemplateImporter.new(import_params).import!
        post :import, params: import_params.merge(:repo => "#{template_fixtures_path}/locking/core_updated", :lock => "true")
        assert_response :success
        templates = JSON.parse(@response.body)['message']['templates']
        templates.each do |template|
          assert template
          assert_not template['imported']
          assert template['changed']
          assert_equal "This template is locked. Please clone it to a new template to customize.", template['validation_errors']['base']
        end
      end

      test "should force update locked template on import" do
        import_params = {
          :repo => "#{template_fixtures_path}/locking/core_initial",
          :prefix => '',
          :associate => "new",
          :lock => 'lock'
        }

        post :import, params: import_params.merge(:repo => "#{template_fixtures_path}/locking/core_updated", :force => true)
        assert_response :success
        updated = JSON.parse(@response.body)['message']['templates']
        updated.each do |template|
          assert template['imported']
        end
      end

      test "should import template with legacy unlock setting" do
        import_params = {
          :repo => "#{template_fixtures_path}/locking/core_initial",
          :prefix => '',
          :associate => "new",
          :lock => "lock",
        }

        ForemanTemplates::TemplateImporter.new(import_params).import!
        post :import, params: import_params.merge(:repo => "#{template_fixtures_path}/locking/core_updated", :lock => "false")
        assert_response :success
        templates = JSON.parse(@response.body)['message']['templates']
        templates.each do |template|
          assert template
          assert template['imported']
          assert template['changed']
          assert_empty template['validation_errors']
          assert_empty template['additional_errors']
        end
      end

      test "should associate template to taxonomies in metadata on import" do
        post :import, params: { "repo" => "#{template_fixtures_path}/with_taxonomies", "prefix" => '', "associate" => "always", "lock" => "lock" }
        assert_response :success
        template = Ptable.unscoped.find_by :name => 'Test Ptable'
        assert_equal 1, template.organizations.count
        assert_equal template.organizations.first.name, @org.name
        assert_equal 1, template.locations.count
        assert_equal template.locations.first.name, @loc.name
      end

      test "should export filtered template only" do
        Dir.mktmpdir do |tmpdir|
          kind = TemplateKind.find_by :name => 'provision'
          FactoryBot.create(:provisioning_template, :name => 'exporting_template', :template_kind => kind)
          post :export, params: { "repo" => tmpdir, "filter" => "exporting_template", "metadata_export_mode" => "refresh" }
          assert_response :success
          assert_includes(Dir.entries("#{tmpdir}/provisioning_templates/provision"), 'exporting_template.erb')
        end
      end

      test "should export all the templates" do
        org = FactoryBot.create(:organization, :name => "org4")
        (1..5).each do |i|
          FactoryBot.create(:ptable, :name => "all_ptable#{i}", :organizations => [org])
          FactoryBot.create(:provisioning_template, :name => "all_ptemplate#{i}", :organizations => [org])
        end
        Dir.mktmpdir do |tmpdir|
          post :export, params: { "repo" => tmpdir, "metadata_export_mode" => "refresh", "organization_id" => org.id }
          assert_response :success
          templates = JSON.parse(@response.body)['message']['templates']
          assert_equal templates.size, 10
        end
      end
    end
  end
end
