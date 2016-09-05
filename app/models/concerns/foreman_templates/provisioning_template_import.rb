module ForemanTemplates::ProvisioningTemplateImport
  extend ActiveSupport::Concern

  module ClassMethods
    def import!(name, text, metadata)
      # Check for snippet type
      return import_snippet!(name, text) if metadata['snippet'] || metadata['kind'] == 'snippet'

      # Get template type
      kind = TemplateKind.find_by_name(metadata['kind'])
      raise NoKindError unless kind

      # Data
      template = ProvisioningTemplate.where(:name => name).first_or_initialize
      data = {
        :template         => text,
        :snippet          => false,
        :template_kind_id => kind.id
      }
      oses = map_oses(metadata)

      # Printout helpers
      c_or_u = template.new_record? ? 'Created' : 'Updated'
      id_string = ('id' + template.id) rescue ''

      if (metadata['associate'] == 'new' && template.new_record?) || (metadata['associate'] == 'always')
        data[:operatingsystem_ids] = oses.map(&:id)
      end

      if data[:template] != template.template
        diff = Diffy::Diff.new(
          template.template,
          data[:template],
          :include_diff_info => true
        ).to_s(:color)
        status  = template.update_attributes(data)
        result  = "  #{c_or_u} Template #{id_string}:#{name}"
        result += "\n    Operatingsystem Associations:\n    - #{oses.map(&:fullname).join("\n    - ")}" unless oses.empty?
      elsif data[:operatingsystem_ids]
        diff    = nil
        status  = template.update_attributes(data)
        result  = "  #{c_or_u} Template Associations #{id_string}:#{name}"
        result += "\n    Operatingsystem Associations:\n    - #{oses.map(&:fullname).join("\n    - ")}" unless oses.empty?
      else
        diff    = nil
        status  = true
        result  = "  No change to Template #{id_string}:#{name}"
      end
      { :diff => diff, :status => status, :result => result }
    end

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
