# frozen_string_literal: true

class MeasurementSerializer < ActiveModel::Serializer
  attributes :id, :site_id, :measure_date, :level, :units, :measure_type
end
