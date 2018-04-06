class TemplatesSyncController < ApplicationController
  def sync
    begin
      ForemanTasks.async_task(::Actions::TemplatesSync::Sync)
      notice _("Added sync foreman templates task to queue, it will be run shortly.")

    rescue ::Foreman::Exception => e
      error _("Failed to add task to queue: %s") % e.to_s
    ensure
      redirect_to settings_path(:anchor => "TemplateSync")
    end
  end
end
