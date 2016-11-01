(function (root) {
  'use strict';
  var _sites = [];
  var _series = {};
  var EVENTS = [SiteConstants.EVENTS.SITE_METADATA_CHANGE, SiteConstants.EVENTS.SERIES_DATA_CHANGE];
  root.SiteDataStore = $.extend({}, EventEmitter.prototype, {

    addChangeListener: function (eventType, callback) {
      if (EVENTS.includes(eventType)) {
        this.on(eventType, callback);
      } else {
        throw "Invalid event type '" + eventType + "'.";
      }
    },

    removeChangeListener: function (eventType, callback) {
      this.removeListener(eventType, callback);
    },

    storeMetaData: function (sites) {
      if (_sites.length === 0) {
        _sites = sites;
        _sites.forEach(function (site) {
          site.iconColor = '000';
          site.icon = SiteConstants.GCHART_LINK;
          site.icon += site.iconColor + '|8|h|000|b|O';
        });
      }

      this._sitesChanged();
    },

    siteMetaData: function () {
      return _sites;
    },

    markerData: function (siteId) {
      var color = StateStore.isSelected(siteId) ? 'F00' : '000';
      var siteData = _sites.find(function (site) {
        return site.id == siteId;
      });

      siteData.iconColor = color;
      siteData.icon = GCHART_LINK + color + '|8|h|' + color + '|b|O';
      return siteData;
    },

    _sitesChanged: function () {
      this.emit(SiteConstants.EVENTS.SITE_METADATA_CHANGE);
    },

    storeSeriesData: function (series) {
      $.extend(_sites, series);
    },

    _seriesChanged: function () {
      this.emit(SiteConstants.EVENTS.SERIES_DATA_CHANGE);
    },

    loadSeries: function (siteIds, callback) {
      var pullIds = [];
      siteIds.forEach(function (id) {
        if (typeof _series[id] !== 'object') {
          pullIds.push(id);
        }
      });

      if (pullIds.count === 0) {
        callback(this.seriesData(siteIds));
      } else {
        debugger;
        SitesAPIUtil.fetchSeriesData(pullIds, callback, siteIds);
      }
    },

    seriesData: function (siteIds) {
      var selectionData = {};
      siteIds.forEach(function (id) {
        selectionData[id] = _series[id];
      });

      return selectionData;
    },

    dispatcherId: AppDispatcher.register(function (payload) {
      if (payload.actionType === SiteConstants.SITE_METADATA_RECEIVED) {
        SiteDataStore.storeMetaData(payload.sites);
      } else if (payload.actionType === SiteConstants.SERIES_DATA_RECEIVED) {
        SiteDataStore.storeSeriesData(payload.series);
      }
    }),
  });
}(this));
