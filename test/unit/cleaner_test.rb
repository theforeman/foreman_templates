require 'test_plugin_helper'

module ForemanTemplates
  class CleanerTest < ActiveSupport::TestCase
    setup do
      @import = Permission.find_or_create_by!(name: 'import_templates', resource_type: 'Template')
      @view = Permission.find_or_create_by!(name: 'view_template_syncs', resource_type: 'Template')
      @role = FactoryBot.create(:role)
      @plugin_filter = FactoryBot.create(:filter, role: @role, permissions: [@import, @view])
      @other_filter = FactoryBot.create(:filter, role: @role, permissions: Permission.where(name: 'view_architectures'))
      Setting[:template_sync_dirname] = '/cleaner-test'
    end

    test 'removes the stored template sync settings' do
      Cleaner.new.clean_up!
      assert_empty Setting.where('name LIKE ?', 'template_sync_%')
    end

    test 'removes the plugin permissions and the filters left empty' do
      Cleaner.new.clean_up!
      assert_empty Permission.where(name: Cleaner::PERMISSIONS)
      refute Filter.exists?(@plugin_filter.id)
      assert Filter.exists?(@other_filter.id)
      assert Role.exists?(@role.id)
    end
  end
end
