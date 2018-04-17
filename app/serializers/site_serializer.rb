# frozen_string_literal: true

class SiteSerializer < ActiveModel::Serializer
  attributes :id, :measurements
  def measurements
    object.measurements.map do |m|
      MeasurementSerializer.new(m, adapter: :json)
    end
  end
end
