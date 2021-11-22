class TemplatesSettingsCategoryToDsl < ActiveRecord::Migration[6.0]
  def up
    Setting.where(category: 'Setting::TemplateSync').update_all(category: 'Setting')
  end
end
