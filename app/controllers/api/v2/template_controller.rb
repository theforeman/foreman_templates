module Api
  module V2
    class TemplateController < ::Api::V2::BaseController
      include ::Foreman::Controller::Parameters::TemplateParams

      resource_description do
        resource_id 'templates'
      end

      def_param_group :foreman_template_sync_params do
        param :branch, String, :required => false, :desc => N_("Branch in Git repo.")
        param :repo, String, :required => false, :desc => N_("Override the default repo from settings.")
        param :filter, String, :required => false, :desc => N_("Export templates with names matching this regex (case-insensitive; snippets are not filtered).")
        param :negate, :bool, :required => false, :desc => N_("Negate the prefix (for purging).")
        param :dirname, String, :required => false, :desc => N_("Directory within Git repo containing the templates.")
        param :http_proxy_policy, ForemanTemplates.http_proxy_policy_types.keys, :required => false, :desc => N_("HTTP proxy policy for template sync." \
          " Use only when synchronizing templates through the HTTP or the HTTPS protocol. If you choose 'selected', provide the `http_proxy_id` parameter.")
        param :http_proxy_id, :number, :required => false, :desc => N_("ID of an HTTP proxy to use for template sync. Use this parameter together with `'http_proxy_policy':'selected'`")
      end

      api :POST, "/templates/import/", N_("Initiate Import")
      param :prefix, String, :required => false, :desc => N_("The string all imported templates should begin with.")
      param :associate, ForemanTemplates.associate_types.keys, :required => false, :desc => N_("Associate to OS's, Locations & Organizations. Options are: always, new or never.")
      param :force, :bool, :required => false, :desc => N_("Update templates that are locked")
      param :lock, ForemanTemplates.lock_types.keys + ["true", "false", "0", "1"], :required => false, :desc => N_("Lock imported templates")
      param :verbose, :bool, :required => false, :desc => N_("Show template diff in response")
      param_group :foreman_template_sync_params
      param_group :taxonomies, ::Api::V2::BaseController
      def import
        verbose = params['verbose']
        @result = ForemanTemplates::TemplateImporter.new(template_import_params).import!
        render :json => { :message => { :templates => @result[:results].map { |res| res.to_h(verbose) },
                                        :repo => @result[:repo],
                                        :branch => @result[:branch] } }
      end

      api :POST, "/templates/export", N_("Initiate Export")
      param :metadata_export_mode, ForemanTemplates.metadata_export_mode_types.keys, :required => false, :desc => N_("Specify how to handle metadata")
      param :commit_msg, String, :desc => N_("Custom commit message for templates export")
      param_group :foreman_template_sync_params
      param_group :taxonomies, ::Api::V2::BaseController
      def export
        @result = ForemanTemplates::TemplateExporter.new(template_export_params).export!
        @result[:templates] = @result[:templates].map(&:to_h)
        render :json => { :message => @result }, :status => @result[:error] ? 500 : 200
      end
    end
  end
end
