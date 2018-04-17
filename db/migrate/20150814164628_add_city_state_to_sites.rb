# frozen_string_literal: true

class AddCityStateToSites < ActiveRecord::Migration
  def change
    add_column :sites, :city, :string
    add_column :sites, :state, :string
    add_column :sites, :zip, :string
  end
end
