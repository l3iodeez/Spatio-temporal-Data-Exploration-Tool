class AddCountToSites < ActiveRecord::Migration
  def change
    add_column :sites, :measure_count, :integer
  end
end
