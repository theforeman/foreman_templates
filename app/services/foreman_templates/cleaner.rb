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
      Permission.where(name: PERMISSIONS).destroy_all
      # clean up any empty filters left behind
      Filter.where.not(id: Filtering.distinct.select(:filter_id)).destroy_all
    end
  end
end
