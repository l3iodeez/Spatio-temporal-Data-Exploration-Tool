(function (root) {
  'use strict';
  var _sites = {};
  var _series = {};
  var EVENTS = [
    SiteConstants.EVENTS.SITE_METADATA_CHANGE,
    SiteConstants.EVENTS.SERIES_DATA_CHANGE,
  ];
  root.SiteDataStore = $.extend({}, EventEmitter.prototype, {

    addChangeListener: function (eventType, callback) {
      if (EVENTS.includes(eventType)) {
        this.on(eventType, callback);
      } else {
        throw 'Invalid event type \'' + eventType + '\'.';
      }
    },

    removeChangeListener: function (eventType, callback) {
      this.removeListener(eventType, callback);
    },

    storeMetaData: function (sites) {
      if (Object.keys(_sites).length === 0) {
        sites.forEach(function (site) {
          _sites[site.id] = site;
        });

        Object.keys(_sites).forEach(function (siteId) {
          _sites[siteId].iconColor = '000';
          _sites[siteId].icon = SiteConstants.GCHART_LINK;
          _sites[siteId].icon += _sites[siteId].iconColor + '|8|h|000|b|O';
        });
      }

      this._sitesChanged();
    },

    siteMetaData: function (siteId) {
      if (siteId) {
        return _sites[siteId];
      }

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
      Object.keys(series).forEach(function (siteId) {
        series[siteId].forEach(function (dataPoint) {
          dataPoint.measureDate = new Date(dataPoint.measureDate);
          dataPoint.level = parseFloat(dataPoint.level, 10);
        });
      });

      $.extend(_series, series);

      this._seriesChanged(this.toPull);
      this.toPull = [];
    },

    _seriesChanged: function (pullIds) {
      this.emit(SiteConstants.EVENTS.SERIES_DATA_CHANGE, pullIds);
    },

    loadSeries: function (siteIds, callback, google) {

      var pullIds = [];
      siteIds.forEach(function (id) {
        if (typeof _series[id] !== 'object') {
          pullIds.push(id);
        }
      });

      this.toPull = pullIds.slice(0);
      if (pullIds.length === 0) {
        if (google) {
          callback(this.seriesDataGoogle(siteIds));
        } else {
          callback(this.seriesData(siteIds));
        }
      } else {
        ApiUtil.fetchSeriesData(pullIds, callback, siteIds);
      }
    },

    seriesDataGoogle: function (siteIds) {
      var data = {
        cols: [
          { id: 'date', label: 'Measurement Date', type: 'date', color: 'red' },
        ],
        rows: [],
      };
      siteIds.forEach(function (id, idx) {
        data.cols.push({ id: String(id), label: _sites[id].site_name, type: 'number' });
      });

      siteIds.forEach(function (id, idx) {
        _series[id].forEach(function (seriesData) {
          var dataRow = new Array(siteIds.length + 1).fill({ v: null });
          dataRow[0] = { v: new Date(seriesData.measureDate) };
          dataRow[idx + 1] = { v: parseFloat(seriesData.level, 10) };
          data.rows.push({ c: dataRow });
        });
      });

      return data;
    },

    seriesData: function (siteIds) {
      var selectionData = {};
      siteIds.forEach(function (id, idx) {
        selectionData[id] = selectionData[id] || [];
        selectionData[id] = _series[id];
      });

      return selectionData;
    },

    _seriesString: function (siteId) {
      var csvData = '';
      _series[siteId].forEach(function (measurement) {
        csvData += measurement.level + ',' + measurement.measure_date + '\n';
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
        array.push({ date: measurement.date, level: measurement.level });
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
