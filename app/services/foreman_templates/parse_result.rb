module ForemanTemplates
  class ParseResult
    def initialize
      @result_lines = []
    end

    def add(line, verbose)
      @result_lines << { :line => line, :verbose => verbose } unless line.empty?
      self
    end

    def to_s(verbose = false)
      if verbose
        map_lines.join("\n")
      else
        map_lines(non_verbose_messages).join("\n")
      end
    end

    def map_lines(result_lines = @result_lines)
      result_lines.map { |item| item[:line] }
    end

    def non_verbose_messages
      @result_lines.select { |item| !item[:verbose] }
    end

    def add_skip_locked(template, metadata)
      add skip_locked_msg(template, output_string(metadata)), true
    end

    def id_string(template)
      template.new_record? ? '' : " id #{template.id}"
    end

    def c_or_u_string(template)
      template.new_record? ? 'Creating' : 'Updating'
    end

    def status_to_text(status, name)
      msg = "#{name} - import "
      msg << if status
               "success"
             else
               'failure'
             end
      msg
    end

    def handle_import_messages(template, diff, attrs_to_update, associations)
      add_status(template)
      if template.errors.any?
        add_errors template
      else
        add_generated_diff diff
        add_associations_result template, associations
      end
      self
    end

    def add_associations_result(template, associations)
      add build_associations_result(template, associations), true
    end

    def build_associations_result(template, associations)
      res  = "  #{c_or_u_string template} Template#{id_string template}:#{template.name}"
      associations.each do |key, values|
        res += "\n    #{key.to_s.capitalize} Associations:\n    - #{values.map { |val| val.public_send template.association_output_method(key) }.join("\n    - ")}" unless values.empty?
      end
      res
    end

    def skip_locked_msg(template, template_type_string)
      "Skipping #{template_type_string}#{id_string template}:#{template.name} - template is locked"
    end

    def output_string(metadata)
      return 'snippet' if metadata['snippet'] || metadata['kind'] == 'snippet'
      metadata['model']
    end

    def add_generated_diff(diff)
      add diff, true
    end

    def add_errors_if_any(template)
      add template.errors, false unless template.errors.empty?
    end

    def add_errors(template)
      errors = template.errors.messages.map do |key, values|
        "#{key}: #{values.join(', ')}"
      end.join(', ')
      add errors, false
    end

    def add_status(template)
      add status_to_text(template.errors.empty?, template.name), false
    end

    def add_result_action(template, metadata)
      add "  #{c_or_u_string(template)} #{output_string metadata}#{id_string template}: #{template.name}", false
    end

    def add_no_change(template, metadata)
      add "  No change to #{output_string metadata}#{id_string template}: #{template.name}", false
    end

    def add_import_errors(error, template)
      add "  Skipping: '#{name}' - #{errors.message}", false
    end

    def add_name_error(name)
      add "  Skipping: '#{name}' - Unknown template model in metadata[:model]", false
    end

    def add_scope_error(name)
      msg = "  Skipping: '#{name}' - Template with given name already exists in different scope and cannot be imported."
      msg += " Change the name of template you are trying to import or fix the organizations/locations of the existing one, "
      msg += "if you are trying to update it."
      add msg, false
    end

    # def get_diff(old, new)
    #   Diffy::Diff.new(old, new, :include_diff_info => true).to_s(:color)
    # end
  end
end
