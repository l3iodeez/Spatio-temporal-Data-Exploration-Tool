# frozen_string_literal: true

class Api::SitesController < ApplicationController
  before_action :set_site, only: :series_csv

  def api_index
    @sites = Site.joins(:measurements).select('sites.*, count(measurements.id) measure_count').group(:id)
    render :api_index
  end

  def load_series_data
    @measurements = Measurement.where(site_id: params[:pullIds]).order(:measure_date)
    data_block = {}
    @measurements.each do |measurement|
      data_block[measurement.site_id] ||= []
      data_block[measurement.site_id] << {
        measureDate: measurement.measure_date.to_time.utc.to_i * 1000,
        siteId:      measurement.site_id,
        level:       measurement.level.to_f
      }
    end
    render json: data_block
  end

  def series_csv
    render text: @site.measurements.pluck(:level).join(',')
  end

  private

  def set_site
    @site = Site.find(params[:id])
  end

  def site_params
    params.require(:site).permit(:city, :state, :zip, :measure_count)
  end
end
