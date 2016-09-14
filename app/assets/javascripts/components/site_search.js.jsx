var SiteSearch = React.createClass({
  getInitialState: function () {
    return {
      query: {},
      selectedSites: [],
    };
  },

  componentDidMount: function () {
    this.loadMap();
    SiteDataStore.addChangeListener(this.loadMarkers);
    StateStore.addChangeListener('siteSelectChange', this.updateMarkers);
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
    newSelection = StateStore.selectedSites();
    var added = newSelection.select(function (siteId) {
      return !this.state.selectedSites.includes(siteId);
    }.bind(this));

    var removed = this.state.selectedSites.select(function (siteId) {
      return !newSelection.includes(siteId);
    }.bind(this));

    this.setState({ selectedSites: StateStore.selectedSites() });
    this.updateColors(added, removed);
  },

  updateColors: function (added, removed) {
    var markers = this.state.map.markers;
    markers.forEach(function (marker) {
      if (added.includes(marker.id) || removed.includes(marker.id)) {
        var siteId = marker.id;
        this.state.map.removeMarker(marker);
        this.state.map.addMarker(SiteDataStore.markerData(siteId));
      }
    }.bind(this));
  },

  render: function () {
    return (
      <div id="map_canvas" style={{ height: '100%', width: '100%' }}></div>
    );
  },

});
