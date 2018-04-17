# frozen_string_literal: true

class AddAddressToSites < ActiveRecord::Migration
  def change
    add_column :sites, :address, :string
  end
end
