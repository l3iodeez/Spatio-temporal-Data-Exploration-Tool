class Api::SitesController < ApplicationController
  before_action :set_site, only: [:show, :edit, :update, :destroy]

  def api_index
    @sites = Site.where("measure_count > 0")
    # @hash = Gmaps4rails.build_markers(@sites) do |site, marker|
    #   site_link = view_context.link_to site.id.to_s, site_path(site.id)
    #   if site.measure_count && site.address
    #     marker.lat site.latitude
    #     marker.lng site.longitude
    #     marker.infowindow("<h4><u>#{site_link}</u></h4> ")
    #   end
    # end
    render @sites
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
