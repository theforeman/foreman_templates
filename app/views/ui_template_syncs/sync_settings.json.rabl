object false

child @results => :results do
  child :import => :import do
    extends "template_sync_settings/show"
  end

  child :export => :export do
    extends "template_sync_settings/show"
  end
end
