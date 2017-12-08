module ForemanTemplates
  module TemplateImportCommon
    extend ActiveSupport::Concern

    def associations_changed?(attrs_to_update)
      association_attrs.any? { |sym| !attrs_to_update[sym].empty? }
    end

    def template_changed?(attrs_to_update)
      template_content != attrs_to_update[template_content_attr]
    end

    def association_output_method(key)
      { :organizations => :name, :location => :name }[key]
    end

    def build_new_associations(metadata)
    end

    module ClassMethods
      def metadata_associations(metadata)
        {
          :locations     => map_metadata(metadata, 'locations'),
          :organizations => map_metadata(metadata, 'organizations')
        }
      end

      def associations_update_attrs(associations)
        {
          :location_ids        => associations[:locations].map(&:id),
          :organization_ids    => associations[:organizations].map(&:id)
        }
      end

      def map_metadata(metadata, param)
        if metadata[param]
          case param
          when 'oses'
            metadata[param].map do |os|
              Operatingsystem.all.map { |db| db.to_label =~ /^#{os}/ ? db : nil }
            end.flatten.compact
          when 'locations'
            metadata[param].map do |loc|
              User.current.my_locations.map { |db| db.name =~ /^#{loc}/ ? db : nil }
            end.flatten.compact
          when 'organizations'
            metadata[param].map do |org|
              User.current.my_organizations.map { |db| db.name =~ /^#{org}/ ? db : nil }
            end.flatten.compact
          end
        else
          []
        end
      end
    end
  end
end
