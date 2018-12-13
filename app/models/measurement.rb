# frozen_string_literal: true

# A single data point
class Measurement < ActiveRecord::Base
  MEASUMENT_NAME = 'Groundwater Level'
  belongs_to :site

  def self.as_csv
    CSV.generate(col_sep: ',', row_sep: "\r\n") do |csv|
      csv << column_names
      all.each do |item|
        csv << item.attributes.values_at(*column_names)
      end
    end
  end
end
