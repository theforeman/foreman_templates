module Api
  module V2
    class TemplateController < ::Api::V2::BaseController
      api :POST, "/template/import/", N_("Initiate Import")
      param :verbose, :bool, :required => false, :desc => N_("Set verbosity of import")
      param :repo, String, :required => false, :desc => N_("Override the default repo from settings.")
      param :branch, String, :required => false, :desc => N_("Branch in Git repo.")
      param :prefix, String, :required => false, :desc => N_("The string all imported templates should begin with.")
      param :dirname, String, :required => false, :desc => N_("The directory within the git tree containing the templates.")
      param :filter, String, :required => false, :desc => N_("Import templates with names matching this regex (case-insensitive; snippets are not filtered).")
      param :negate, :bool, :required => false, :desc => N_("Negate the prefix (for purging).")
      param :associate, Setting::TemplateSync.associate_types.keys, :required => false, :desc => N_("Associate to OS's, Locations & Organizations. Options are: always, new or never.")
      param :force, :bool, :required => false, :desc => N_("Update templates that are locked")
      param :lock, :bool, :required => false, :desc => N_("Lock imported templates")

      def import
        results = ForemanTemplates::TemplateImporter.new({
          verbose:   params['verbose'],
          repo:      params['repo'],
          branch:    params['branch'],
          prefix:    params['prefix'],
          dirname:   params['dirname'],
          filter:    params['filter'],
          associate: params['associate'],
          negate:    params['negate'],
          force:     params['force'],
          lock:      params['lock'],
        }).import!
        render :json => { :message => results }
      end

      api :POST, "/template/export", N_("Initiate Export")
      param :verbose, :bool, :required => false, :desc => N_("Set verbosity of export")
      param :repo, String, :required => false, :desc => N_("Override the default repo from settings")
      param :branch, String, :required => false, :desc => N_("Branch in Git repo.")
      param :filter, String, :required => false, :desc => N_("Export templates with names matching this regex (case-insensitive; snippets are not filtered).")
      param :negate, :bool, :required => false, :desc => N_("Negate the prefix (for purging).")
      param :metadata_export_mode, Setting::TemplateSync.metadata_export_mode_types.keys, :required => false, :desc => N_("Specify how to handle metadata")
      param :dir, String, :required => false, :desc => N_("The directory within Git repo")
      def export
        ForemanTemplates::TemplateExporter.new({
          verbose:              params['verbose'],
          repo:                 params['repo'],
          branch:               params['branch'],
          filter:               params['filter'],
          negate:               params['negate'],
          metadata_export_mode: params['metadata_export_mode'],
          dir:                  params['dir']
        }).export!
        render :json => { :message => _('Success') }
      rescue => e
        logger.debug e
        render :json => { :message => (_('Something went wrong during export: %s') % e.message) }, :status => 500
      end
    end
  end
end
