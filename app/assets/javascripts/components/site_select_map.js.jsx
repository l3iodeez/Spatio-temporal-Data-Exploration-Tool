var SiteSelectMap = React.createClass({
  getInitialState: function () {
    return {
      query: {},
      selectedSites: [],
      markers: [],
    };
  },

  componentDidMount: function () {
    window.loadMap = this.loadMap;
    SiteDataStore.addChangeListener(this.loadMarkers);
    StateStore.addChangeListener(StateConstants.EVENTS.SITE_SELECT_CHANGE, this.updateMarkers);
    StateStore.addChangeListener(StateConstants.EVENTS.HELD_KEYS_CHANGE, this.keyChange);
    SitesAPIUtil.fetchSiteMetadata();
  },

  componentWillUnmount: function () {
    SiteDataStore.removeChangeListener(this.loadMarkers);
    StateStore.removeChangeListener(StateConstants.EVENTS.SITE_SELECT_CHANGE, this.updateMarkers);
    StateStore.removeChangeListener(StateConstants.EVENTS.HELD_KEYS_CHANGE, this.keyChange);
  },

  loadMap: function () {
    this.setState({
      map: new google.maps.Map(document.getElementById('map_canvas'), {
        center: { lat: 37.945, lng: -97.648, },
        zoom: 4,
      }),
    });

    // google.maps.event.addListener(this.state.map, StateConstants.EVENTS.MOUSEMOVE, function (e) {
    //   console.log({lat: e.latLng.lat(), lng: e.latLng.lng()});
    // });

  },

  loadMarkers: function () {
    this.addMarkers(SiteDataStore.siteMetaData());
    this.forceUpdate();
  },

  addMarkers: function (siteData) {
    var markers = [];
    for (i = 0; i < siteData.length; i++) {
      var position = new google.maps.LatLng(siteData[i].lat, siteData[i].lng);
      marker = new google.maps.Marker({
        position: position,
        map: this.state.map,
        title: siteData[i].site_name,
        id: siteData[i].id,
        icon: siteData[i].icon,
      });
      google.maps.event.addListener(marker, StateConstants.EVENTS.CLICK, (function (siteId) {
            return function () {
              StateStore.toggleSite(siteId);
              this.updateMarkers();
            }.bind(this);
          }.bind(this)(siteData[i].id)));
      markers.push(marker);
    }

    this.setState({ markers: markers });
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

    this.state.markers.forEach(function (marker) {
      if (added.includes(marker.id)) {
        marker.setIcon(SiteConstants.GCHART_LINK + 'F00|8|h|F00|b|O');
      } else if (removed.includes(marker.id)) {
        marker.setIcon(SiteConstants.GCHART_LINK + '000|8|h|000|b|O');
      }
    }.bind(this));
  },

  mapMouseDown: function (evt) {
      console.log('mousedown');
      if (this.state.rectangle !== undefined) {
        this.state.rectangle.setMap(null);
      }

      var bounds = {
        north: evt.latLng.lat(),
        south: evt.latLng.lat(),
        east: evt.latLng.lng(),
        west: evt.latLng.lng(),
      };
      this.setState({
        bounds: bounds,
        rectangle: new google.maps.Rectangle({
          clickable: false,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: this.state.map,
          bounds: bounds,
        }),
      });
      google.maps.event.addListener(
        this.state.map,
        StateConstants.EVENTS.MOUSEMOVE,
        this.updateRectangle
      );
    },

  mapMouseUp: function () {
    console.log('mouseup');
    google.maps.event.clearListeners(this.state.map, StateConstants.EVENTS.MOUSEMOVE);
  },

  keyChange: function (keyId, changeType) {
    if (keyId === StateConstants.KEY_CODES.SHIFT && changeType === StateConstants.EVENTS.KEYDOWN) {
      console.log('keydown');
      google.maps.event.addListener(
        this.state.map,
        StateConstants.EVENTS.MOUSEDOWN,
        this.mapMouseDown
      );
      google.maps.event.addListener(this.state.map, StateConstants.EVENTS.MOUSEUP, this.mapMouseUp);

      this.state.map.setOptions({
        draggable: false,
        draggableCursor: 'crosshair',
        draggingCursor: 'crosshair',
      });
    } else if (
      keyId === StateConstants.KEY_CODES.SHIFT &&
      changeType === StateConstants.EVENTS.KEYUP
    ) {
      console.log('keyup');
      google.maps.event.clearListeners(this.state.map, StateConstants.EVENTS.MOUSEUP);
      google.maps.event.clearListeners(this.state.map, StateConstants.EVENTS.MOUSEDOWN);
      google.maps.event.clearListeners(this.state.map, StateConstants.EVENTS.MOUSEMOVE);
      this.state.map.setOptions({
        draggable: true,
        draggableCursor: null,
        draggingCursor: null,
      });
    }
  },

  updateRectangle: function (evt) {
    console.log('mousemove');
    var bounds = {
      north: this.state.bounds.north,
      south: evt.latLng.lat(),
      east: evt.latLng.lng() > this.state.bounds.west ? evt.latLng.lng() : this.state.bounds.west,
      west: evt.latLng.lng() <= this.state.bounds.west ? evt.latLng.lng() : this.state.bounds.west,
    };
    this.state.rectangle.setOptions({
      bounds: bounds,
    });
  },

  render: function () {
    return (
      <div
        id="map_canvas"
        style={{ height: '100%', width: '100%' }}>
      </div>
    );
  },

});
