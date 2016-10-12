(function (root) {
  'use strict';
  var _sites = [];
  var CHANGE_EVENT = 'siteDataChange';
  root.SiteDataStore = $.extend({}, EventEmitter.prototype, {

    addChangeListener: function (callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
      this.removeListener(CHANGE_EVENT, callback);
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
      this.emit(CHANGE_EVENT);
    },

    dispatcherId: AppDispatcher.register(function (payload) {
      if (payload.actionType === SiteConstants.SITE_METADATA_RECEIVED) {
        SiteDataStore.storeMetaData(payload.sites);
      }
    }),
  });
}(this));
