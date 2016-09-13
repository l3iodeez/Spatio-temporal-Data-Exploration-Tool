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
          site.icon = 'https://chart.googleapis.com/chart?chst=d_text_outline&chld=';
          site.icon += site.iconColor + '|8|h|000|b|O';
          site.click = function (e) {
            StateStore.toggleSite(site.id);
          }.bind(this);
        });
      }

      this._sitesChanged();
    },

    updateColors: function () {

      if (_sites.length > 0) {
        _sites.forEach(function (site) {
          if (StateStore.isSelected(site.id)) {
            site.iconColor = 'F00';
          } else {
            site.iconColor = '000';
          }

          site.icon = 'https://chart.googleapis.com/chart?chst=d_text_outline&chld=';
          site.icon += site.iconColor + '|8|h|000|b|O';
        }.bind(this));
      }

      this._sitesChanged();
    },

    siteMetaData: function () {
      return _sites;
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
