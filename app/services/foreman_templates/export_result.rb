module ForemanTemplates
  class ExportResult
    attr_reader :template, :name, :template_file, :exported, :additional_info

    def initialize(template, exported = true)
      @template = template
      @exported = exported
      @name = template.name
      @template_file = template.template_file
    end

    def to_h
      {
        :id => template.id,
        :name => @name,
        :exported => @exported,
        :type => template.class.name.underscore,
        :additional_info => @additional_info
      }
    end

    def matching_filter
      generic_info "Skipping, 'name' filtered out based on 'filter' and 'negate' settings"
    end

    def generic_info(additional_msg)
      @exported = false
      @additional_info = additional_msg
      Logging.logger('app').debug "Not exporting #{@template.name}: #{additional_msg}"
      self
    end
  end
end
