# frozen_string_literal: true

# Creates SavedSelections table
class CreateSavedSelections < ActiveRecord::Migration
  def change
    create_table :saved_selections do |t|
      t.references :user, index: true, foreign_key: true
      t.string :name
      t.json :site_ids
    end
  end
end
