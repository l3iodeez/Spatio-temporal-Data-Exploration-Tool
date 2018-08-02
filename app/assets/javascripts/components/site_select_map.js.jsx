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
    SiteDataStore.addChangeListener(SiteConstants.EVENTS.SITE_METADATA_CHANGE, this.loadMarkers);
    StateStore.addChangeListener(StateConstants.EVENTS.SITE_SELECT_CHANGE, this.updateMarkers);
    StateStore.addChangeListener(StateConstants.EVENTS.HELD_KEYS_CHANGE, this.keyChange);
    StateStore.addChangeListener(StateConstants.EVENTS.LOGIN_STATE_CHANGE, this.clearOnLogout);
    ApiUtil.fetchSiteMetadata();
  },

  componentWillUnmount: function () {
    SiteDataStore.removeChangeListener(SiteConstants.EVENTS.SITE_METADATA_CHANGE, this.loadMarkers);
    StateStore.removeChangeListener(StateConstants.EVENTS.SITE_SELECT_CHANGE, this.updateMarkers);
    StateStore.removeChangeListener(StateConstants.EVENTS.HELD_KEYS_CHANGE, this.keyChange);
  },

  loadMap: function () {
    var canvasId = 'map_canvas-' + this.props.className.split(' ').join('');
    this.setState({
      map: new google.maps.Map(document.getElementById(canvasId), {
        center: { lat: 37.945, lng: -97.648, },
        zoom: 4,
      }),
    });
  },

  loadMarkers: function () {
    this.createMarkers(SiteDataStore.siteMetaData());
  },

  createMarkers: function (siteData) {
    var markers = [];
    Object.keys(siteData).forEach(function (siteId) {
      var position = new google.maps.LatLng(siteData[siteId].lat, siteData[siteId].lng);
      marker = new google.maps.Marker({
        position: position,
        map: this.state.map,
        title: siteData[siteId].site_name,
        id: siteData[siteId].id,
        icon: siteData[siteId].icon,
      });
      marker.addListener(StateConstants.EVENTS.CLICK, function (_marker) {
        return function () {
          this.markerClick(_marker);
        }.bind(this);
      }.bind(this)(marker));
      markers.push(marker);

    }.bind(this));

    this.setState({ markers: markers });
  },

  markerClick: function (marker) {
    StateStore.toggleSite(marker.id);
  },

  updateMarkers: function (added, removed) {
    this.state.markers.forEach(function (marker) {
      if (added && added.includes(marker.id)) {
        marker.setIcon(SiteConstants.GCHART_LINK + 'F00|8|h|F00|b|O');
      } else if (removed && removed.includes(marker.id)) {
        marker.setIcon(SiteConstants.GCHART_LINK + '000|8|h|000|b|O');
      }
    }.bind(this));
  },

  clearOnLogout: function (loginData) {
    if (!loginData.loggedIn) {
      this.setState({
        selectedSites: [],
      })
    }
  },

  mapMouseDown: function (evt) {
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
    google.maps.event.clearListeners(this.state.map, StateConstants.EVENTS.MOUSEMOVE);
    ids = [];
    this.state.markers.forEach(function (marker) {
      if (this.state.rectangle.getBounds().contains(marker.getPosition())) {
        ids.push(marker.id);
      }
    }.bind(this));

    if (StateStore.isHeld(StateConstants.KEY_CODES.ALT) ||
        StateStore.isHeld(StateConstants.KEY_CODES.RCMD) ||
        StateStore.isHeld(StateConstants.KEY_CODES.LCMD)) {
      StateStore.removeSites(ids);
    } else {
      StateStore.selectSites(ids);
    }

    this.state.rectangle.setOptions({ map: null });
  },

  keyChange: function (keyId, changeType) {
    if (keyId === StateConstants.KEY_CODES.SHIFT && changeType === StateConstants.EVENTS.KEYDOWN) {
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
      this.state.markers.forEach(function (marker) {
        marker.setOptions({ clickable: false });
      });
    } else if (
      keyId === StateConstants.KEY_CODES.SHIFT &&
      changeType === StateConstants.EVENTS.KEYUP
    ) {

      google.maps.event.clearListeners(this.state.map, StateConstants.EVENTS.MOUSEUP);
      google.maps.event.clearListeners(this.state.map, StateConstants.EVENTS.MOUSEDOWN);
      google.maps.event.clearListeners(this.state.map, StateConstants.EVENTS.MOUSEMOVE);

      this.state.map.setOptions({
        draggable: true,
        draggableCursor: null,
        draggingCursor: null,
      });
      this.state.markers.forEach(function (marker) {
        marker.setOptions({ clickable: true });
      });
    }
  },

  updateRectangle: function (evt) {
    var bounds = {
      north: Math.max(this.state.bounds.north, evt.latLng.lat()),
      south: Math.min(this.state.bounds.south, evt.latLng.lat()),
      east: Math.max(evt.latLng.lng(), this.state.bounds.west),
      west: Math.min(evt.latLng.lng(), this.state.bounds.west),
    };
    this.state.rectangle.setOptions({
      bounds: bounds,
    });
  },

  render: function () {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <div
          id={'map_canvas-' + this.props.className.split(' ').join('')}
          style={{ height: '90%', width: '100%' }}>
        </div>
      </div>
    );
  },

});
