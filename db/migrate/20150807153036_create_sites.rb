class CreateSites < ActiveRecord::Migration
  def change
    create_table :sites do |t|
      t.string :site_name
      t.string :well_reference
      t.float :latitude
      t.float :longitude
      t.datetime :start
      t.datetime :end
    end
  end
end
