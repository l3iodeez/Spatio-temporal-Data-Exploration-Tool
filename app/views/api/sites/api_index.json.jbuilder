  json.array!(@sites) do |site|
    # json.partial!('/api/sites/site', site: site),
    json.id site.id
    json.site_name site.site_name
    json.lng site.longitude
    json.lat site.latitude
    # json.infowindow <<-HTML
    #   <h4>
    #     <ul>
    #       <li>Site id #{site.id}</li>
    #       <li>Number of measurements #{site.measure_count}</li>
    #       <li><a href="#">Select</a></li>
    #     </ul>
    #   </h4>
    # HTML

    json.address site.address
    json.city site.city
    json.state site.state
    json.zip site.zip
    json.measure_count site.measure_count
  end
