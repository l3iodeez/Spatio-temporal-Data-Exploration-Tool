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
    @measurements = Measurement.where("site_id = " + params[:site_id])
    respond_with(@measurements.as_csv)
end

end