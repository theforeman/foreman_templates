module ForemanTemplates::PtableImport
  extend ActiveSupport::Concern

  module ClassMethods
    def import!(name, text, metadata)
      # Check for snippet type
      return import_snippet!(name, text) if metadata['snippet']

      # Data
      ptable = Ptable.where(:name => name).first_or_initialize
      data = {
        :layout => text
      }
      oses          = map_metadata(metadata, 'oses')
      locations     = map_metadata(metadata, 'locations')
      organizations = map_metadata(metadata, 'organizations')

      # Printout helpers
      c_or_u = ptable.new_record? ? 'Created' : 'Updated'
      id_string = ('id' + ptable.id) rescue ''

      if (metadata['associate'] == 'new' && ptable.new_record?) || (metadata['associate'] == 'always')
        data[:os_family]        = oses.map(&:family).uniq.first
        data[:location_ids]     = locations.map(&:id)
        data[:organization_ids] = organizations.map(&:id)
      end

      if data[:layout] != ptable.layout
        diff = Diffy::Diff.new(
          ptable.layout,
          data[:layout],
          :include_diff_info => true
        ).to_s(:color)
        status  = ptable.update_attributes(data)
        result  = "  #{c_or_u} Ptable #{id_string}:#{name}"
        result += "\n    Operatingsystem Family:\n    - #{oses.map(&:family).uniq.first}" unless oses.empty?
        result += "\n    Organizations Associations:\n    - #{organizations.map(&:name).join("\n    - ")}" unless organizations.empty?
        result += "\n    Location Associations:\n    - #{locations.map(&:name).join("\n    - ")}" unless locations.empty?
      elsif data[:os_family] || data[:location_ids] || data[:organization_ids]
        diff    = nil
        status  = ptable.update_attributes(data)
        result  = "  #{c_or_u} Ptable Associations #{id_string}:#{name}"
        result += "\n    Operatingsystem Family:\n    - #{oses.map(&:family).uniq.first}" unless oses.empty?
        result += "\n    Organizations Associations:\n    - #{organizations.map(&:name).join("\n    - ")}" unless organizations.empty?
        result += "\n    Location Associations:\n    - #{locations.map(&:name).join("\n    - ")}" unless locations.empty?
      else
        diff    = nil
        status  = true
        result  = "  No change to Ptable #{id_string}:#{name}"
      end
      { :diff => diff, :status => status, :result => result }
    end
  end
end
