module Foreman
  module Controller
    module Parameters
      module TemplateParams
        extend ActiveSupport::Concern
        include Foreman::Controller::Parameters::Taxonomix

        class_methods do
          def filter_params_list
            %i(verbose repo branch dirname filter negate metadata_export_mode dirname)
          end

          def extra_import_params
            %i(associate force prefix lock)
          end

          def extra_export_params
            [:metadata_export_mode]
          end

          def template_params_filter(extra_params = [])
            Foreman::ParameterFilter.new(Hash).tap do |filter|
              filter.permit filter_params_list.concat(extra_params)
            end
          end
        end

        def template_import_params
          add_taxonomy_params(self.class.template_params_filter(self.class.extra_import_params)
            .filter_params(params, parameter_filter_context, :none).with_indifferent_access)
        end

        def template_export_params
          add_taxonomy_params(self.class.template_params_filter(self.class.extra_export_params)
            .filter_params(params, parameter_filter_context, :none).with_indifferent_access)
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
