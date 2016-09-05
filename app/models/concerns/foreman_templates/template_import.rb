module ForemanTemplates::TemplateImport
  extend ActiveSupport::Concern

  module ClassMethods
    def import_snippet!(name, text)
      # Data
      snippet = self.where(:name => name).first_or_initialize
      data = {
        :template => text,
        :snippet  => true
      }

      # Printout helpers
      c_or_u = snippet.new_record? ? 'Created' : 'Updated'
      id_string = ('id' + snippet.id) rescue ''

      if data[:template] != snippet.template
        diff = Diffy::Diff.new(
          snippet.template,
          data[:template],
          :include_diff_info => true
        ).to_s(:color)
        status  = snippet.update_attributes(data)
        result  = "  #{c_or_u} Snippet #{id_string}:#{name}"
      else
        diff    = nil
        status  = true
        result  = "  No change to Snippet #{id_string}:#{name}"
      end
      { :diff => diff, :status => status, :result => result }
    end
  end
end
