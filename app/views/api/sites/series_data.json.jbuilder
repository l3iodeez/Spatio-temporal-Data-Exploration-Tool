json.array!(@sites) do |site|
  json.id site.id
  json.measure_count site.measure_count
  json.array!(site.measurements) do |measurement|
    measurement.measure_date
    measurement.water_level
  end
end
