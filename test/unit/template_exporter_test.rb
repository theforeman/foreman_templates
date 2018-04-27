require 'test_plugin_helper'

module ForemanTemplates
  class TemplateExporterTest < ActiveSupport::TestCase
    before do
      @exporter = TemplateExporter.new
    end

    describe '#templates_to_dump' do
      before do
        @template = FactoryBot.create(:provisioning_template, :name => 'included')
      end

      test 'finds existing templates' do
        assert_includes @exporter.templates_to_dump, @template
      end

      test 'finds templates based on filter' do
        ignored = FactoryBot.create(:provisioning_template, :name => 'not-included')
        @exporter.stubs(:filter).returns('\Aincluded\Z')
        @exporter.stubs(:negate).returns(false)
        result = @exporter.templates_to_dump
        assert_includes result, @template
        refute_includes result, ignored
      end

      test 'filter can be negated' do
        ignored = FactoryBot.create(:provisioning_template, :name => 'not-included')
        @exporter.stubs(:filter).returns('\Aincluded\Z')
        @exporter.stubs(:negate).returns(true)
        result = @exporter.templates_to_dump
        refute_includes result, @template
        assert_includes result, ignored
      end
    end

    describe '#templates_to_dump limited to taxonomies' do
      before do
        @org = FactoryBot.create(:organization, :name => 'TemplateOrg')
        @empty = FactoryBot.create(:organization, :name => 'EmptyOrg')
        @ptable = FactoryBot.create(:ptable, :name => 'exported_ptable', :organizations => [@org])
        FactoryBot.create(:ptable, :name => 'not_exported_ptable', :organizations => [@empty])
        @provisioning_template = FactoryBot.create(:provisioning_template, :name => 'exported_template', :organizations => [@org])
        FactoryBot.create(:provisioning_template, :name => 'not_exported_template')
      end

      test 'should export templates only from specified org by id' do
        exporter = TemplateExporter.new(:filter => "", :organization_params => { :organization_ids => [@org.id] })
        templates = exporter.templates_to_dump
        assert_equal 2, templates.count
        assert templates.include?(@ptable)
        assert templates.include?(@provisioning_template)
      end

      test 'should export templates only from specified org by name' do
        exporter = TemplateExporter.new(:filter => "", :organization_params => { :organization_names => [@org.name] })
        templates = exporter.templates_to_dump
        assert_equal 2, templates.count
        assert templates.include?(@ptable)
        assert templates.include?(@provisioning_template)
      end

      test 'should export template only in both organization and location' do
        loc =  FactoryBot.create(:location, :name => 'TemplateLoc')
        template = FactoryBot.create(:provisioning_template, :name => 'exported_template_with_taxonomies', :organizations => [@org], :locations => [loc])
        exporter = TemplateExporter.new(:filter => "", :organization_params => { :organization_ids => [@org.id] }, :location_params => { :location_ids => [loc.id] })
        templates = exporter.templates_to_dump
        assert_equal 1, templates.count
        assert templates.include?(template)
      end
    end

    describe '#get_template_filename(template)' do
      before do
        @template = FactoryBot.create(:provisioning_template, :name => 'template name')
      end

      test 'converts spaces to underscores and suffixes with .erb' do
        assert_equal 'template_name.erb', @exporter.get_template_filename(@template)
      end

      test 'weird characters are properly replaced or escaped' do
        @template.name = "a/b'c d"
        assert_equal "a_b\\'c_d.erb", @exporter.get_template_filename(@template)
      end
    end

    describe '#get_dump_dir' do
      before do
        @template = FactoryBot.create(:provisioning_template)
      end

      test 'underscores the model name based on type' do
        @exporter.instance_variable_set('@dir', '/tmp')
        assert_equal "/tmp/provisioning_templates/#{@template.template_kind.name}", @exporter.get_dump_dir(@template)
      end

      test 'appends template kind if the template knows it, defaulting to snippet' do
        @exporter.instance_variable_set('@dir', '/tmp')
        @template.template_kind.name = nil
        assert_equal "/tmp/provisioning_templates/snippet", @exporter.get_dump_dir(@template)
      end

      test 'does not appends anything for template without kind' do
        @exporter.instance_variable_set('@dir', '/tmp')
        template = FactoryBot.create(:ptable)
        assert_equal "/tmp/partition_tables_templates/", @exporter.get_dump_dir(template)
      end

      test 'appends configured dirname to temp dir' do
        @exporter.instance_variable_set('@dir', '/tmp')
        @exporter.stubs(:dirname).returns('extra_path')
        assert_equal "/tmp/extra_path/provisioning_templates/#{@template.template_kind.name}", @exporter.get_dump_dir(@template)
      end
    end
  end
end
