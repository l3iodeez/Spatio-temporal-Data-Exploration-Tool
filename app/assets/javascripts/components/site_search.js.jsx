var SiteSearch = React.createClass({
  getInitialState: function() {
    return {query: {}};
  },
  // componentWillMount: function() {
  //
  // },
  componentDidMount: function() {
    handler = Gmaps.build('Google');
    handler.buildMap({ provider: {}, internal: {id: 'map_canvas'}}, function(){
      markers = handler.addMarkers("asss");
      handler.bounds.extendWith(markers);
      handler.fitMapToBounds();
    });
  },
  render: function() {
    return (
      <div id="map_canvas"></div>
    );
  }
});
