class Api::SitesController < ApplicationController
  before_action :set_site, only: [:show, :edit, :update, :destroy]

  def api_index
    @sites = Site.where("measure_count > 0")
    render :api_index
  end

  def load_series_data
    @sites = Site.where(id: params[:pullIds])
    render json: @sites
  end

  private
    # Use callbacks to share common setup or constraints between actions.
  def set_site
    @site = Site.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def site_params
    params.require(:site).permit(:city, :state, :zip, :measure_count)
  end
end
