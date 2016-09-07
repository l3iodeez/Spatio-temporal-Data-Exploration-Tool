var SiteSearch = React.createClass({
  getInitialState: function () {
    return {
      query: {},
    };
  },

  componentDidMount: function () {
    this.loadMap();
    SiteDataStore.addChangeListener(this.loadMarkers);
    StateStore.addChangeListener('siteSelectChange', this.updateColors);
    SitesAPIUtil.fetchSiteMetadata();
  },

  loadMap: function () {
    this.setState({
      map: new GMaps({
        div: '#map_canvas',
        lat: 37.945,
        lng: -97.64805556,
        zoom: 3,
      }),
    });
  },

  loadMarkers: function () {
    this.state.map.addMarkers(SiteDataStore.siteMetaData());
    this.forceUpdate();
  },
  
  updateMarkers: function () {
    
  },
  updateColors: function () {
    SiteDataStore.updateColors();
    this.loadMarkers();
  },

  render: function () {
    return (
      <div id="map_canvas" style={{"height": "100%", "width": "100%"}}></div> 
    );
  },

});
