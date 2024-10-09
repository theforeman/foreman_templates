require 'securerandom'

module ForemanTemplates
  class Action
    delegate :logger, :to => :Rails

    def self.git_repo_start_with
      %w{http:// https:// git:// ssh:// git+ssh:// ssh+git://}
    end

    def self.file_repo_start_with
      ['/']
    end

    def self.repo_start_with
      git_repo_start_with + file_repo_start_with
    end

    def self.setting_overrides
      %i(verbose prefix dirname filter repo negate branch http_proxy_policy)
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
      @repo.start_with?(*self.class.git_repo_start_with)
    end

    def get_absolute_repo_path
      File.expand_path(@repo)
    end

    def verify_path!(path)
      msg = _("Using file-based synchronization, but couldn't access %s. ") % path
      msg += _("Please check the access permissions/SELinux and make sure it is readable/writable for the web application user account, typically '%s'.") % 'foreman'
      raise PathAccessException, msg unless Dir.exist?(path)
    end

    private

    def assign_attributes(args = {})
      @http_proxy_id = args[:http_proxy_id]
      self.class.setting_overrides.each do |attribute|
        instance_variable_set("@#{attribute}", args[attribute.to_sym] || Setting["template_sync_#{attribute}".to_sym])
      end
    end

    protected

    def init_git_repo
      git_repo = Git.init(@dir)

      case @http_proxy_policy
      when 'global'
        http_proxy_url = Setting[:http_proxy]
      when 'selected'
        http_proxy = HttpProxy.authorized(:view_http_proxies).with_taxonomy_scope.find(@http_proxy_id)
        http_proxy_url = http_proxy.full_url

        if URI(http_proxy_url).scheme == 'https' && http_proxy.cacert.present?
          proxy_cert = "#{@dir}/.git/foreman_templates_proxy_cert_#{SecureRandom.hex(8)}.crt"
          File.write(proxy_cert, http_proxy.cacert)
          git_repo.config('http.proxySSLCAInfo', proxy_cert)
        end
      end

      if http_proxy_url.present?
        git_repo.config('http.proxy', http_proxy_url)
      end

      git_repo.add_remote('origin', @repo)
      logger.debug "cloned '#{@repo}' to '#{@dir}'"
      git_repo
    end
  end
end
