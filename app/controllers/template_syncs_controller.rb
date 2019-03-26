class TemplateSyncsController < ReactController
  def index
  end

  def action_permission
    case params[:action]
    when 'index'
      :view_template_syncs
    else
      super
    end
  end
end
