module Api
  module V2
    class TemplateController < ::Api::V2::BaseController
      include ::Foreman::Controller::Parameters::TemplateParams

      def_param_group :foreman_template_sync_params do
        param :branch, String, :required => false, :desc => N_("Branch in Git repo.")
        param :repo, String, :required => false, :desc => N_("Override the default repo from settings.")
        param :filter, String, :required => false, :desc => N_("Export templates with names matching this regex (case-insensitive; snippets are not filtered).")
        param :negate, :bool, :required => false, :desc => N_("Negate the prefix (for purging).")
        param :dirname, String, :required => false, :desc => N_("The directory within Git repo containing the templates")
        param :verbose, :bool, :required => false, :desc => N_("Set verbosity of import")
      end

      api :POST, "/templates/import/", N_("Initiate Import")
      param :prefix, String, :required => false, :desc => N_("The string all imported templates should begin with.")
      param :associate, Setting::TemplateSync.associate_types.keys, :required => false, :desc => N_("Associate to OS's, Locations & Organizations. Options are: always, new or never.")
      param :force, :bool, :required => false, :desc => N_("Update templates that are locked")
      param :lock, :bool, :required => false, :desc => N_("Lock imported templates")
      param_group :foreman_template_sync_params
      def import
        results = ForemanTemplates::TemplateImporter.new(template_import_params).import!
        render :json => { :message => results }
      end

      api :POST, "/templates/export", N_("Initiate Export")
      param :metadata_export_mode, Setting::TemplateSync.metadata_export_mode_types.keys, :required => false, :desc => N_("Specify how to handle metadata")
      param_group :foreman_template_sync_params
      def export
        ForemanTemplates::TemplateExporter.new(template_export_params).export!
        render :json => { :message => _('Success') }
      rescue StandardError => e
        logger.debug e
        render :json => { :message => (_('Something went wrong during export: %s') % e.message) }, :status => 500
      end
    end
  end
end
