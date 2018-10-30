class RenameWaterLevel < ActiveRecord::Migration
  def change
    rename_column :measurements, :water_level, :level
  end
end
