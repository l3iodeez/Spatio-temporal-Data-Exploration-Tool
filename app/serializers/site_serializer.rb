# frozen_string_literal: true

class SiteSerializer < ActiveModel::Serializer
  attributes :id, :measurements
  def measurements
    Rails.cache.fetch("site-#{object.id}-measurements", :expires_in => 30.days) do
      object.measurements.map do |m|
        MeasurementSerializer.new(m, adapter: :json)
      end
    end
  end
end
