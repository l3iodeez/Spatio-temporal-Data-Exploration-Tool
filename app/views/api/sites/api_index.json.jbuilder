# frozen_string_literal: true

json.array!(@sites) do |site|
  json.id site.id
  json.site_name site.site_name
  json.lng site.longitude
  json.lat site.latitude
  json.address site.address
  json.city site.city
  json.state site.state
  json.zip site.zip
  json.measure_count site.measure_count
end
