var SiteSearch = React.createClass({
  getInitialState: function() {
    return {
      query: {}
     };
  },
  componentWillMount: function() {
    SitesAPIUtil.fetchSiteMetadata();
    SiteDataStore.addChangeListener(this.loadMarkers);
  },
  loadMarkers: function() {
    // handler = Gmaps.build('Google');
    // handler.buildMap({ provider: {}, internal: {id: 'map_canvas'}}, function(){
    //   markers = handler.addMarkers(SiteDataStore.siteMetaData());
    //   debugger
    //   handler.bounds.extendWith(markers);
    //   handler.fitMapToBounds();
    // }.bind(this));
    var map;
    var layer_0;
      map = new google.maps.Map(document.getElementById('map_canvas'), {
        center: new google.maps.LatLng(21.113040668158696, -155.63472860153698),
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      layer_0 = new google.maps.FusionTablesLayer({
        query: {
          select: "col3",
          from: "11Ij2XebnhSeA4Btr4CsNg84oOc8GjiaNK6-iRgYv"
        },
        map: map,
        styleId: 2,
        templateId: 2
      });

  },
  render: function() {
    return (
      <div id="map_canvas" style={{"height": "100%", "width": "100%"}}></div>    );
  }
});
