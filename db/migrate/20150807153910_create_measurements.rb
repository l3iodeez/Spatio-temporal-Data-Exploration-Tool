class CreateMeasurements < ActiveRecord::Migration
  def change
    create_table :measurements do |t|
    	t.references :site
      t.string :site_name
      t.date :measure_date
      t.decimal :water_level
      t.string :units
      t.string :measure_type
      t.string :data_provider
    end
  end
end
