# frozen_string_literal: true

# SavedSelectionsController
class Api::SavedSelectionsController < ApplicationController
  before_action :authenticate_user!
  # Get all saved selections for logged in user.
  def ajax_get_all
    hash = {}
    current_user.saved_selections.each do |s|
      hash[s.name] = s.site_ids
    end
    render :json => hash
  end

  # Create a new saved selection
  def ajax_create
    created = []
    params[:selections]&.keys&.each do |name|
      created << current_user.saved_selections.create!(
        :name     => name,
        :site_ids => params[:selections][name].map(&:to_i)
      )
    end

    render :json => { :success => true, :created => created, :authToken => form_authenticity_token }
  end

  # Delete a saved selection
  def ajax_delete
    selection = current_user.saved_selections.where(:name => params[:name])
    selection.destroy
    render :json => { :success => true, :authToken => form_authenticity_token }
  end
end
