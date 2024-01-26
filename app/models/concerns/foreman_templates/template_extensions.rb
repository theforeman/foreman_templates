require 'shellwords'

module ForemanTemplates
  module TemplateExtensions
    extend ActiveSupport::Concern

    def template_file
      Shellwords.escape("#{name.downcase.tr(' /', '_')}.erb")
    end
  end
end
