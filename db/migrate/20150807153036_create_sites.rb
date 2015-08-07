class CreateSites < ActiveRecord::Migration
  def change
    create_table :sites do |t|
      t.string :site_name
      t.string :source
      t.decimal :lat
      t.decimal :long
      t.datetime :start
      t.datetime :end
    end
  end
end
