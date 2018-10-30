# frozen_string_literal: true

json.array!(@measurements) do |measurement|
  json.site_id measurement.site_id
  json.measure_date measurement.measurement
  json.level measurement.level
end
