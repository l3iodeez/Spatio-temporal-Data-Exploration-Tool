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
      series.forEach(function (site) {
        var _siteSeries = {};
        _siteSeries[site.id] = site.measurements;
        $.extend(_series, _siteSeries);
      });

      this._seriesChanged(this.toPull);
      this.toPull = [];
    },

    _seriesChanged: function (pullIds) {
      this.emit(SiteConstants.EVENTS.SERIES_DATA_CHANGE, pullIds);
    },

    loadSeries: function (siteIds, callback) {
      this.toPull = siteIds.slice(0);
      var pullIds = [];
      siteIds.forEach(function (id) {
        if (typeof _series[id] !== 'object') {
          pullIds.push(id);
        }
      });

      this.toPull = pullIds.slice(0);
      if (pullIds.count === 0) {
        callback(this.seriesData(siteIds));
      } else {
        SitesAPIUtil.fetchSeriesData(pullIds, callback, siteIds);
      }
    },

    seriesData: function (siteIds) {
      var selectionData = {};
      siteIds.forEach(function (id) {
        _series[id].forEach(function (measurement) {
          selectionData[id] = [];
          selectionData[id][measurement.measure_date] = measurement.water_level;
        });
      });

      return selectionData;
    },

    _seriesString: function (siteId) {
      var csvData = '';
      _series[siteId].forEach(function (measurement) {
        csvData += measurement.water_level + ',' + measurement.measure_date + '\n';
      });

      return {
        siteId: siteId,
        measure_type: _series[siteId][0].measure_type,
        series: csvData,
      };
    },

    _seriesObject: function (siteId) {
      var array = [];
      _series[siteId].forEach(function (measurement) {
        array.push({ date: measurement.date, water_level: measurement.water_level });
      });

      return array;
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
