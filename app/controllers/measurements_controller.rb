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
	@current_site = Site.find(params[:site_id])
  @measurements = @current_site.measurements
  respond_with(@measurements.as_csv)
end

end
