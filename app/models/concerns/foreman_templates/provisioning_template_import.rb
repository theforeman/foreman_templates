module ForemanTemplates
  module ProvisioningTemplateImport
    extend ActiveSupport::Concern

    module ClassMethods
      def import!(name, text, metadata, force = false)
        # Check for snippet type
        return import_snippet!(name, text, force) if metadata['snippet'] || metadata['kind'] == 'snippet'

        # Get template type
        kind = TemplateKind.find_by(name: metadata['kind'])
        raise NoKindError unless kind

        # Data
        template = ProvisioningTemplate.where(:name => name).first_or_initialize
        data = {
          :template         => text,
          :snippet          => false,
          :template_kind_id => kind.id
        }
        oses          = map_metadata(metadata, 'oses')
        locations     = map_metadata(metadata, 'locations')
        organizations = map_metadata(metadata, 'organizations')

        # Printout helpers
        c_or_u = template.new_record? ? 'Creating' : 'Updating'
        id_string = template.new_record? ? '' : "id #{template.id}"
        if template.locked? && !template.new_record? && !force
          return { :diff => nil,
                   :status => false,
                   :result => "Skipping Template #{id_string}:#{name} - template is locked" }
        end

        associate_metadata data, template, metadata, oses, organizations, locations

        diff = nil
        status = nil
        if template_changed?(data, template)
          diff = create_diff(data, template)
          template.ignore_locking do
            status = template.update_attributes(data)
          end
          result = build_associations_result c_or_u, id_string, name, oses, organizations, locations
        else
          status  = true
          result  = "  No change to Template #{id_string}:#{name}"
        end

        { :diff => diff, :status => status, :result => result, :errors => template.errors }
      end

      def associate_metadata(data, template, metadata, oses, organizations, locations)
        if (metadata['associate'] == 'new' && template.new_record?) || (metadata['associate'] == 'always')
          data[:operatingsystem_ids] = oses.map(&:id)
          data[:location_ids]        = locations.map(&:id)
          data[:organization_ids]    = organizations.map(&:id)
        end
        data
      end

      def build_associations_result(c_or_u, id_string, name, oses, organizations, locations)
        res  = "  #{c_or_u} Template #{id_string}:#{name}"
        res += "\n    Operatingsystem Associations:\n    - #{oses.map(&:fullname).join("\n    - ")}" unless oses.empty?
        res += "\n    Organizations Associations:\n    - #{organizations.map(&:name).join("\n    - ")}" unless organizations.empty?
        res += "\n    Location Associations:\n    - #{locations.map(&:name).join("\n    - ")}" unless locations.empty?
        res
      end

      def create_diff(data, template)
        if template_content_changed?(template.template, data[:template])
          Diffy::Diff.new(
            template.template,
            data[:template],
            :include_diff_info => true
          ).to_s(:color)
        else
          nil
        end
      end

      def template_content_changed?(template_template, data_template)
        template_template != data_template
      end

      def associations_changed?(data)
        !(data[:operatingsystem_ids] || data[:location_ids] || data[:organization_ids]).nil?
      end

      def template_changed?(data, template)
        template_content_changed?(template.template, data[:template]) || associations_changed?(data)
      end
    end
  end
end
