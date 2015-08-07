class CreateMeasurements < ActiveRecord::Migration
  def change
    create_table :measurements do |t|
      t.string :site_name
      t.date :measure_date
      t.decimal :water_level
      t.string :units
      t.string :type
    end
  end
end
