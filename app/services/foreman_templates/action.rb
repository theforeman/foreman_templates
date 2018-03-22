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

    def get_default_branch(repo)
      branch_names = repo.branches.map(&:name).uniq

      # Always use develop on Foreman-nightly, if present, or else relevant stable branch
      target = SETTINGS[:version].tag == 'develop' ? 'develop' : "#{SETTINGS[:version].short}-stable"
      return target if branch_names.include?(target)

      # stay on default branch as fallback
      nil
    end

    def git_repo?
      @repo.start_with?('http://', 'https://', 'git://', 'ssh://', 'git+ssh://', 'ssh+git://')
    end

    def get_absolute_repo_path
      File.expand_path(@repo)
    end

    def verify_path!(path)
      raise "Using file-based synchronization, but couldn't find #{path}" unless Dir.exist?(path)
    end

    private

    def assign_attributes(args = {})
      self.class.setting_overrides.each do |attribute|
        instance_variable_set("@#{attribute}", args[attribute.to_sym] || Setting["template_sync_#{attribute}".to_sym])
      end
    end
  end
end
