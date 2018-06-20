# frozen_string_literal: true

# SavedSelectionsController
class SavedSelectionsController < ApplicationController
  before_action :authenticate_user
  # Get all saved selections for logged in user.
  def ajax_get_all
    render :json => current_user.saved_selections.map { |s| { :name => s.name, :site_ids => s.site_ids } }
  end

  # Create a new saved selection
  def ajax_create
    current_user.saved_selections.create!({ :name => params[:name], :site_ids => params[:site_ids] } )

    render :json => { :success => true }
  end

  # Delete a saved selection
  def ajax_delete
    selection = current_user.saved_selections.where(:name => params[:name])
    selection.destroy
    render :json => { :success => true }
  end
end
