module ForemanTemplates
  class Cleaner
    def clean_up!
      remove_settings
    end

    private

    def remove_settings
      Setting::TemplateSync.destroy_all
    end
  end
end
