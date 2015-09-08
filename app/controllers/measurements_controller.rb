class MeasurementsController < ApplicationController

 respond_to :html, :json, :csv

  def index
    @measurements = Measurement.all
    respond_with(@measurements)
  end

  def as_csv
    attributes
  end

def show
	@current_site = Site.where("id = " + params[:site_id])
	@graph_sites = []
 
	@current_site[0].nearbys(50).each { |x| @graph_sites.push(x.id) }
	@measurements = Measurement.where(:site_id => @graph_sites)


    #@measurements = Measurement.where("site_id = " + params[:site_id])
    respond_with(@measurements.as_csv)
end

end