module Actions
  module TemplatesSync
    class Sync < Actions::Base

      def plan
        ::Foreman::Logging.logger('foreman_templates').info "Initiating 'sync' for templates."

        # Make sure we don't have two concurrent listening services competing
        if already_running?
          fail "Action #{self.class.name} is already active"
        end
        plan_self
      end

      def run
        ::Foreman::Logging.logger('foreman_templates').info "Running 'sync' for templates."
        output[:data] = ForemanTemplates::TemplateImporter.new({
          verbose: true,
        }).import!
        output[:data].join("\n")
      end

      def humanized_name
        _("Sync Foreman Templates")
      end

      # default value for cleaning up the tasks, it can be overriden by settings
      def self.cleanup_after
        '30d'
      end
    end
  end
end
