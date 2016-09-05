module ForemanTemplates::PtableImport
  extend ActiveSupport::Concern

  module ClassMethods
    def import!(name, text, metadata)
      # Check for snippet type
      return import_snippet!(name, text) if metadata['snippet']

      # Data
      ptable = Ptable.where(:name => name).first_or_initialize
      data = { :layout => text }
      oses = map_oses(metadata)

      # Printout helpers
      c_or_u = ptable.new_record? ? 'Created' : 'Updated'
      id_string = ('id' + ptable.id) rescue ''

      if (metadata['associate'] == 'new' && ptable.new_record?) || (metadata['associate'] == 'always')
        data[:os_family] = oses.map(&:family).uniq.first
      end

      if data[:layout] != ptable.layout
        diff = Diffy::Diff.new(
          ptable.layout,
          data[:layout],
          :include_diff_info => true
        ).to_s(:color)
        status  = ptable.update_attributes(data)
        result  = "  #{c_or_u} Ptable #{id_string}:#{name}"
      elsif data[:os_family]
        diff    = nil
        status  = ptable.update_attributes(data)
        result  = "  #{c_or_u} Ptable Associations #{id_string}:#{name}"
        result += "\n    Operatingsystem Family:\n    - #{oses.map(&:family).uniq.first}" unless oses.empty?
      else
        diff    = nil
        status  = true
        result  = "  No change to Ptable #{id_string}:#{name}"
      end
      { :diff => diff, :status => status, :result => result }
    end

    # TODO: DRY this, it's copied from ProvisioningTemplateImport
    def map_oses(metadata)
      if metadata['oses']
        metadata['oses'].map do |os|
          Operatingsystem.all.map { |db| db.to_label =~ /^#{os}/ ? db : nil }
        end.flatten.compact
      else
        []
      end
    end
  end
end
