require 'ostruct'

class UiTemplateSyncsController < ApplicationController
  include ::Foreman::Controller::Parameters::TemplateParams

  def sync_settings
    import_settings = Setting.where :name => Setting::TemplateSync.import_setting_names(['verbose'])
    export_settings = Setting.where :name => Setting::TemplateSync.export_setting_names(['verbose'])
    @results = OpenStruct.new(:import => import_settings, :export => export_settings)
  end

  def import
    # todo: add permissions
    @parse_result = OpenStruct.new ForemanTemplates::TemplateImporter.new(ui_template_import_params).import!
  end

  def export
    # todo: add permissions
    @result = ForemanTemplates::TemplateExporter.new(ui_template_export_params).export!
  end

  def action_permission
    case params[:action]
    when 'sync_settings'
      :view
    else
      super
    end
  end

  def parameter_filter_context
    Foreman::ParameterFilter::Context.new(:api, controller_name, params[:action])
  end
end
