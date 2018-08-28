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

      test "should import filtered templates" do
        post :import, params: { "repo" => "#{ForemanTemplates::Engine.root}/test/templates/core", "filter" => 'filter1', "prefix" => "filtTemp_", "associate" => "new"}
        assert_response :success
        templates = JSON.parse(@response.body)['message']['templates']
        templates.each do |template|
          if template['name'] == 'filtTemp_filter1 template'
            assert template['imported']
          end
        end
      end

      test "should not import negate filtered templates" do
        post :import, params: { "repo" => "#{ForemanTemplates::Engine.root}/test/templates/core", "filter" => 'filter1', "prefix" => '', "negate" => true }
        assert_response :success
        templates = JSON.parse(@response.body)['message']['templates']
        templates.each do |template|
          if template['name'] == 'filter1 template'
            assert_not template['imported']
          end
        end
      end

      test "should import from git branch" do
        post :import, params: { "repo" => 'https://github.com/SatelliteQE/foreman_templates.git', "prefix" => "gitBranch", "branch" => "example", "associate" => "new" }
        assert_response :success
        templates = JSON.parse(@response.body)['message']['templates']
        assert_equal templates.length, 11
        templates.each do |template|
          assert template['imported']
        end
      end

      test "should import from git repository directory" do
        post :import, params: { "repo" => 'https://github.com/SatelliteQE/foreman_templates.git', "prefix" => "repodir", "branch" => "example", "associate" => "new", "dirname" => "import" }
        assert_response :success
        templates = JSON.parse(@response.body)['message']['templates']
        assert_equal templates.length, 10
        templates.each do |template|
          puts template
          assert template['imported']
        end
      end

      test "should not update locked template on import" do
        post :import, params: { "repo" => "#{ForemanTemplates::Engine.root}/test/templates/core", "filter" => "filter1", "prefix" => '', "associate" => "new", "lock" => true }
        File.open("#{ForemanTemplates::Engine.root}/test/templates/core/filter1.erb", "a") do |filt|
          filt << "Appended from test\n"
        end
        post :import, params: { "repo" => "#{ForemanTemplates::Engine.root}/test/templates/core", "filter" => "filter1", "prefix" => '', "associate" => "new", "lock" => true }
        assert_response :success
        uptemplates = JSON.parse(@response.body)['message']['templates']
        uptemplates.each do |template|
          if template['name'] == 'filter1 template'
            assert_not template['imported']
            assert template['changed']
          end
        end
      end

      test "should force update locked template on import" do
        post :import, params: { "repo" => "#{ForemanTemplates::Engine.root}/test/templates/core", "filter" => "filter1", "prefix" => '', "associate" => "new", "lock" => true }
        File.open("#{ForemanTemplates::Engine.root}/test/templates/core/filter1.erb", "a") do |filt|
          filt << "Appended from another test \n"
        end
        post :import, params: { "repo" => "#{ForemanTemplates::Engine.root}/test/templates/core", "filter" => "filter1", "prefix" => '', "associate" => "new", "lock" => true, "force" => true }
        assert_response :success
        updated = JSON.parse(@response.body)['message']['templates']
        updated.each do |template|
          if template['name'] == 'filter1 template'
            puts template
          end
        end
      end

      test "should associate template to taxonomies in metadata on import" do
        Dir.mktmpdir do |tmpdir|
          t_name = "metadata_with_taxonomies"
          org = taxonomies(:organization1)
          loc = taxonomies(:location1)
          create_local_template t_folder: tmpdir, t_filename: "metadata", t_name: t_name, org: org.name, loc: loc.name
          post :import, params: { "repo" => tmpdir, "filter" => t_name, "prefix" => '', "associate" => "always" }
          assert_response :success
          assert_equal ProvisioningTemplate.unscoped.find_by_name(t_name).organizations[0].name, org.name
          assert_equal ProvisioningTemplate.unscoped.find_by_name(t_name).locations[0].name, loc.name
        end
      end

      test "should export filtered template only" do
        Dir.mktmpdir do |tmpdir|
          kind = TemplateKind.find_by :name => 'provision'
          FactoryBot.create(:provisioning_template, :name => 'exporting_template', :template_kind => kind)
          post :export, params: { "repo" => tmpdir, "filter" => "exporting_template", "metadata_export_mode" => "refresh" }
          assert_response :success
          assert Dir.entries("#{tmpdir}/provisioning_templates/provision").include?('exporting_template.erb')
        end
      end

      test "should import accordingly to exported template metadata" do
        org = taxonomies(:organization2)
        loc = taxonomies(:location2)
        name = "taxo_metadata_import"
        templte = "<%#\nmodel: ProvisioningTemplate\nkind: provision\nname: #{name}\norganizations: #{org.name}\nlocations: #{loc.name}\n-%>\nimport metadata"
        ProvisioningTemplate.create!(:name => name, :template => templte)
        Dir.mktmpdir do |tmpdir|
          post :export, params: { "repo" => tmpdir, "filter" => name, "metadata_export_mode" => "refresh"}
          post :import, params: { "repo" => tmpdir, "filter" => name, "prefix" => "expMeta_", "associate" => "new" }
          assert_response :success
          assert_equal ProvisioningTemplate.unscoped.find_by_name(name).organizations[0].name, org.name
          assert_equal ProvisioningTemplate.unscoped.find_by_name(name).locations[0].name, loc.name
        end
      end

      test "should export all the templates" do
        org = FactoryBot.create(:organization, :name => "org4")
        for i in 1..5
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

      private
      def create_local_template(t_folder:, t_filename:, t_name:, model: "ProvisioningTemplate", kind: "provision", org: "", loc: "")
        File.open("#{t_folder}/#{t_filename}.erb", "w") { |template|
          template << "<%#\n"
          template << "model: #{model}\n"
          template << "kind: #{kind}\n"
          template << "name: #{t_name}\n"
          template << "oses:\n"
          template << "- Debian 6.0\n"
          template << "organizations: #{org}\n" if org
          template << "locations: #{loc}\n" if loc
          template << "-%>\n"
          template << "testing #{t_name} #{model} .."
        }
      end
    end
  end
end
