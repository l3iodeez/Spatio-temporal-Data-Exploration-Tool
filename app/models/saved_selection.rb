# frozen_string_literal: true

# Set of site ids saved by user
class SavedSelection < ActiveRecord::Base
  belongs_to :user
  validates :name, :uniqueness => { :scope => :user_id }
end
