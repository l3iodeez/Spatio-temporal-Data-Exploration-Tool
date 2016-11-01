json.array!(@sites) do |site|
  json.id site.array!(@measurements) do |measurement|
    json.water_level measurement.water_level
  end
end
