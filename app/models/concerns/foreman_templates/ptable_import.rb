module ForemanTemplates
  module PtableImport
    extend ActiveSupport::Concern

    module ClassMethods
      def import!(name, text, metadata, force = false, lock = false)
        # Check for snippet type
        return import_snippet!(name, text, force) if metadata['snippet']

        # Data
        ptable = Ptable.where(:name => name).first_or_initialize
        data = {
          :layout => text
        }
        data[:locked] = lock if lock
        oses          = map_metadata(metadata, 'oses')
        locations     = map_metadata(metadata, 'locations')
        organizations = map_metadata(metadata, 'organizations')

        # Printout helpers
        c_or_u = ptable.new_record? ? 'Creating' : 'Updating'
        id_string = ptable.new_record? ? '' : "id #{ptable.id}"
        if ptable.locked && !ptable.new_record? && !force
          return { :diff => nil,
                   :status => false,
                   :result => "Skipping Partition Table #{id_string}:#{name} - partition table is locked" }
        end

        associate_metadata data, ptable, metadata, oses, organizations, locations

        diff = nil
        status = nil
        if ptable_changed?(data, ptable)
          diff = create_diff(data, ptable)
          ptable.ignore_locking do
            status = ptable.update_attributes(data)
          end
          result  = build_associations_result c_or_u, id_string, name, oses, organizations, locations
        else
          status  = true
          result  = "  No change to Ptable #{id_string}:#{name}"
        end
        { :diff => diff, :status => status, :result => result, :errors => ptable.errors }
      end

      def associate_metadata(data, ptable, metadata, oses, organizations, locations)
        if (metadata['associate'] == 'new' && ptable.new_record?) || (metadata['associate'] == 'always')
          data[:operatingsystem_ids] = oses.map(&:id)
          data[:os_family]           = oses.map(&:family).uniq.first
          data[:location_ids]        = locations.map(&:id)
          data[:organization_ids]    = organizations.map(&:id)
        end
        data
      end

      def ptable_content_changed?(data_layout, ptable_layout)
        data_layout != ptable_layout
      end

      def associations_changed?(data)
        !(data[:os_family] || data[:location_ids] || data[:organization_ids]).nil?
      end

      def data_changed?(data, ptable)
        (!data[:locked].nil? && data[:locked] != ptable.locked)
      end

      def create_diff(data, ptable)
        if ptable_content_changed?(data[:layout], ptable.layout)
          Diffy::Diff.new(
            ptable.layout,
            data[:layout],
            :include_diff_info => true
          ).to_s(:color)
        else
          nil
        end
      end

      def build_associations_result(c_or_u, id_string, name, oses, organizations, locations)
        res  = "  #{c_or_u} Ptable #{id_string}:#{name}"
        res += "\n    Operatingsystem Family:\n    - #{oses.map(&:family).uniq.first}" unless oses.empty?
        res += "\n    Operatingsystem Associations:\n    - #{oses.map(&:fullname).join("\n    - ")}" unless oses.empty?
        res += "\n    Organizations Associations:\n    - #{organizations.map(&:name).join("\n    - ")}" unless organizations.empty?
        res += "\n    Location Associations:\n    - #{locations.map(&:name).join("\n    - ")}" unless locations.empty?
        res
      end

      def ptable_changed?(data, ptable)
        ptable_content_changed?(data[:layout], ptable.layout) || associations_changed?(data) || data_changed?(data, ptable)
      end
    end
  end
end
