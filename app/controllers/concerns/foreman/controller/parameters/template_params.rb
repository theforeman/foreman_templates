module Foreman
  module Controller
    module Parameters
      module TemplateParams
        extend ActiveSupport::Concern
        include Foreman::Controller::Parameters::Taxonomix

        class_methods do
          def filter_params_list
            %i(verbose repo branch dirname filter negate metadata_export_mode http_proxy_policy http_proxy_id)
          end

          def extra_import_params
            %i(associate force prefix lock)
          end

          def extra_export_params
            %i(metadata_export_mode commit_msg)
          end

          def template_params_filter(extra_params = [])
            Foreman::ParameterFilter.new(Hash).tap do |filter|
              filter.permit filter_params_list.concat(extra_params)
            end
          end
        end

        def ui_template_import_params
          base_import_params :ui_template_sync
        end

        def ui_template_export_params
          base_export_params :ui_template_sync
        end

        def template_import_params
          transform_lock_param add_taxonomy_params(base_import_params(:none))
        end

        def transform_lock_param(params)
          lock = params[:lock]
          return params if lock.nil?

          if lock == "true" || lock.is_a?(TrueClass) || lock.to_s == "1"
            log_deprecated_param(lock)
            params[:lock] = "lock"
          end

          if lock == "false" || lock.is_a?(FalseClass) || lock.to_s == "0"
            log_deprecated_param(lock)
            params[:lock] = "unlock"
          end
          params
        end

        def log_deprecated_param(value)
          Logging.logger('app').warn "Using '#{value}' as a value for lock when syncing templates is deprecated and will be removed in the future."
        end

        def template_export_params
          add_taxonomy_params(base_export_params(:none))
        end

        def base_import_params(toplevel_key)
          self.class.template_params_filter(self.class.extra_import_params)
              .filter_params(params, parameter_filter_context, toplevel_key).with_indifferent_access
        end

        def base_export_params(toplevel_key)
          self.class.template_params_filter(self.class.extra_export_params)
              .filter_params(params, parameter_filter_context, toplevel_key).with_indifferent_access
        end

        def organization_params
          self.class.organization_params_filter(Hash).filter_params(params, parameter_filter_context, :none)
        end

        def location_params
          self.class.location_params_filter(Hash).filter_params(params, parameter_filter_context, :none)
        end

        private

        def add_taxonomy_params(params)
          params.merge(:organization_params => organization_params.to_h).merge(:location_params => location_params.to_h)
        end
      end
    end
  end
end
