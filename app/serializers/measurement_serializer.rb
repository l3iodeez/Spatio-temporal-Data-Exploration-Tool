class MeasurementSerializer < ActiveModel::Serializer
  attributes :id, :site_id, :measure_date, :water_level, :units, :measure_type
end