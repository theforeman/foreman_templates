module ForemanTemplatesHelper
  def edit_paths
    Template.subclasses.reduce({}) do |memo, subclass|
      memo.tap do |acc|
        path_part = "#{subclass.name.underscore.pluralize}_path"
        acc[subclass.name] = "#{Rails.application.routes.url_helpers.public_send(path_part)}/:id/edit"
      end
    end
  end
end
