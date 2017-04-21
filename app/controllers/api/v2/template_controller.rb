module Api
  module V2
    class TemplateController < ::Api::V2::BaseController

      api :POST, "/template/import/", N_("Initiate Import")
      param :repo, String, :required => false, :desc => N_("Import templates from a different repo.")
      param :branch, String, :required => false, :desc => N_("Branch in Git repo.")
      param :prefix, String, :required => false, :desc => N_("The string all imported templates should begin with.")
      param :dirname, String, :required => false, :desc => N_("The directory within the git tree containing the templates.")
      param :filter, String, :required => false, :desc => N_("Import names matching this regex (case-insensitive; snippets are not filtered).")
      param :negate, :bool, :required => false, :desc => N_("Negate the prefix (for purging).")
      param :associate, String, :required => false, :desc => N_("Associate to OS's, Locations & Organizations. Options are: always, new or never.")
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
        }).import!
        render :json => {:message => results}
      end
    end
  end
end
