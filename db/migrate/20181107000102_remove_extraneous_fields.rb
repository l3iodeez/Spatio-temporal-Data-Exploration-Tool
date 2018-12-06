# frozen_string_literal: true

class RemoveExtraneousFields < ActiveRecord::Migration
  def change
    remove_column :sites, :measure_count
    remove_column :sites, :start
    remove_column :sites, :end
    remove_column :sites, :full_json
    remove_column :measurements, :full_json
    remove_column :sites, :full_json
  end
end
