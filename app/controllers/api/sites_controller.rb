# frozen_string_literal: true

class Api::SitesController < ApplicationController
  before_action :set_site, only: :series_csv

  def api_index
    @sites = Site.joins(:measurements).select('sites.*, count(measurements.id) measure_count').group(:id)
    render :api_index
  end

  def load_series_data
    get_measurments
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

  def csv_download
    get_measurments
    if @measurements.present?
      data = @measurements.map(&:attributes)
      csv = data.map do |d|
        d.values.join(',')
      end
      csv.unshift(data.first.keys.join(','))
      csv = csv.join("\n")
      filename = "selected_site_data_#{@start_date}_#{@end_date}.csv"
      render csv: csv, filename: filename
    else
      render text: ""
    end

  end

  def series_csv
    render text: @site.measurements.pluck(:level).join(',')
  end

  private

  def get_measurments
    @measurements = Measurement.where(site_id: params[:pullIds]).order(:measure_date)
    if params[:filterDates]
      filter_dates = params[:filterDates].split(',')
      @start_date = filter_dates.first
      @end_date = filter_dates.last
      @measurements = @measurements.where("measure_date BETWEEN ? and ?", @start_date, @end_date)
    end

  end

  def set_site
    @site = Site.find(params[:id])
  end

  def site_params
    params.require(:site).permit(:city, :state, :zip, :measure_count)
  end
end
