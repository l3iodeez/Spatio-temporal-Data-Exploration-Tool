json.array!(@measurements) do |measurement|
  json.site_id measurement.site_id
  json.measure_date measurement.measurement
  json.water_level measurement.water_level
end