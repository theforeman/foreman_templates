module ForemanTemplates
  class ParseResult
    attr_accessor :name, :template
    attr_reader :imported, :diff, :exception, :additional_errors, :template_file, :additional_info

    def initialize(template_file)
      @template_file = template_file.split('/').last
    end

    def to_h(verbose = false)
      res = {
        :name => @name,
        :id => @template.present? ? @template.id : nil,
        :changed => changed?,
        :imported => @imported,
        :additional_errors => @additional_errors,
        :exception => @exception ? @exception.message : nil,
        :validation_errors => errors.to_h,
        :file => @template_file,
        :type => @template.present? ? @template.class.name.underscore : nil
      }

      # false comes as a string when using rake tasks
      res[:diff] = @diff if verbose && verbose != 'false'
      res
    end

    def errors
      @template ? @template.errors : nil
    end

    def corrupted_metadata
      generic_error "Failed to parse metadata"
    end

    def matching_filter
      generic_info "Skipping, 'name' filtered out based on 'filter' and 'negate' settings"
    end

    def no_metadata_name
      generic_error "No 'name' found in metadata"
    end

    def missing_model
      generic_error "No 'model' found in metadata"
    end

    def generic_error(additional_msg)
      @imported = false
      @additional_errors = additional_msg
      Logging.logger('app').debug "Error in '#{@template_file}': #{additional_msg}"
      self
    end

    def check_for_errors
      @imported = @template.errors.blank?
      self
    end

    def add_exception(exception)
      @imported = false
      @exception = exception
      self
    end

    def generic_info(additional_msg)
      @imported = false
      @additional_info = additional_msg
      Logging.logger('app').debug "Not importing #{@template_file}: #{additional_msg}"
      self
    end

    def name_error(exception, template_type)
      @imported = false
      @exception = exception
      @additional_errors = "Template type #{template_type} was not found, are you missing a plugin?"
      self
    end

    def determine_result_diff
      return if @template.nil? || !@template.template_changed?

      template_was = @template.template_was
      template_is = @template.template
      @diff = calculate_diff(template_was, template_is)
    end

    def changed?
      @diff.present?
    end

    def calculate_diff(old, new)
      if old.present? && new.present? && old != new
        Diffy::Diff.new(old, new, :include_diff_info => true).to_s(:color)
      else
        nil
      end
    end
  end
end
