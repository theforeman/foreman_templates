module ForemanTemplates
  class Cleaner
    PERMISSIONS = %w[import_templates export_templates view_template_syncs].freeze

    def clean_up!
      remove_settings
      remove_permissions
    end

    private

    def remove_settings
      Setting.where('name LIKE ?', 'template_sync_%').delete_all
    end

    def remove_permissions
      permission_ids = Permission.where(name: PERMISSIONS).pluck(:id)
      return if permission_ids.empty?

      filter_ids = Filtering.where(permission_id: permission_ids).distinct.pluck(:filter_id)
      Filtering.where(permission_id: permission_ids).delete_all
      Filter.where(id: filter_ids).find_each { |filter| filter.destroy if filter.filterings.reload.empty? }
      Permission.where(id: permission_ids).delete_all
    end
  end
end
