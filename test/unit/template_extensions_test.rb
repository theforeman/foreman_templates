require 'test_plugin_helper'

module ForemanTemplates
  class TemplateExtensionsTest < ActiveSupport::TestCase
    class TestClass
      include ForemanTemplates::TemplateExtensions
      attr_reader :name

      def initialize(name)
        @name = name
      end
    end

    describe 'template_file' do
      test 'converts spaces to underscores and suffixes with .erb' do
        instance = TestClass.new('template name')
        assert_equal 'template_name.erb', instance.template_file
      end

      test 'weird characters are properly replaced or escaped' do
        instance = TestClass.new("a/b'c d")
        assert_equal "a_b\\'c_d.erb", instance.template_file
      end
    end
  end
end
