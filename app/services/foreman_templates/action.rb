module ForemanTemplates
  class Action
    delegate :logger, :to => :Rails

    def self.setting_overrides
      %i(verbose prefix dirname filter repo negate branch)
    end

    def method_missing(method, *args, &block)
      if self.class.setting_overrides.include?(method)
        instance_variable_get("@#{method}")
      else
        super
      end
    end

    def respond_to_missing?(method, include_private = false)
      self.class.setting_overrides.include?(method)
    end

    def initialize(args = {})
      @taxonomies = { :organizations => args[:organization_params] || {},
                      :locations => args[:location_params] || {} }
      assign_attributes args
    end

    def git_repo?
      @repo.start_with?('http://', 'https://', 'git://', 'ssh://', 'git+ssh://', 'ssh+git://')
    end

    def get_absolute_repo_path
      File.expand_path(@repo)
    end

    def verify_path!(path)
      msg = _("Using file-based synchronization, but couldn't access %s to export templates. ") % path
      msg += _("Please check the access permissions/SELinux and make sure it is writable for the web application user account, typically 'foreman'.")
      raise msg unless Dir.exist?(path)
    end

    private

    def assign_attributes(args = {})
      self.class.setting_overrides.each do |attribute|
        instance_variable_set("@#{attribute}", args[attribute.to_sym] || Setting["template_sync_#{attribute}".to_sym])
      end
    end
  end
end
