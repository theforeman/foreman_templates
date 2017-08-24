# RuboCop::TargetFinder.new(nil)

module RuboCop
  class TargetFinder
    def ruby_file_with_erb?(file)
      ruby_file_without_erb?(file) || File.extname(file) == '.erb'
    end

    alias_method :ruby_file_without_erb?, :ruby_file?
    alias_method :ruby_file?, :ruby_file_with_erb?
  end
end
