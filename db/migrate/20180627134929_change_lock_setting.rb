class ChangeLockSetting < ActiveRecord::Migration[5.1]
  def up
    Setting.find_by(:name => 'template_sync_lock')&.destroy
  end
end
