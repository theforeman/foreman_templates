module ForemanTemplates
  module TemplateImport
    extend ActiveSupport::Concern

    module ClassMethods
      def import_snippet!(name, text, force = false, lock = false)
        # Data
        snippet = self.where(:name => name).first_or_initialize
        data = {
          :template => text,
          :snippet  => true
        }
        data[:locked] = lock if lock

        # Printout helpers
        c_or_u = snippet.new_record? ? 'Creating' : 'Updating'
        id_string = snippet.new_record? ? '' : "id #{snippet.id}"

        if snippet.locked? && !snippet.new_record? && !force
          return { :diff => nil,
                   :status => false,
                   :result => "Skipping snippet #{id_string}:#{name} - template is locked" }
        end

        status = nil
        if data[:template] != snippet.template
          diff = Diffy::Diff.new(
            snippet.template,
            data[:template],
            :include_diff_info => true
          ).to_s(:color)
          snippet.ignore_locking do
            status = snippet.update_attributes(data)
          end
          result  = "  #{c_or_u} Snippet #{id_string}:#{name}"
        else
          diff    = nil
          status  = true
          result  = "  No change to Snippet #{id_string}:#{name}"
        end
        { :diff => diff, :status => status, :result => result, :errors => snippet.errors }
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
