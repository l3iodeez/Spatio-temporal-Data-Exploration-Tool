(function(root) {
  'use strict';
  var _sites = [];
  var CHANGE_EVENT = "siteDataChange";
  root.SiteDataStore = $.extend({}, EventEmitter.prototype, {



    addChangeListener: function(callback){
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback){
      this.removeListener(CHANGE_EVENT, callback);
    },
    storeMetaData: function (sites) {
      if (_sites.length === 0) {
        _sites = sites;
      }
      this._sitesChanged();
    },
    siteMetaData: function () {
      return _sites;
    },
    _sitesChanged : function () {
      this.emit(CHANGE_EVENT);
    },
    dispatcherId: AppDispatcher.register(function (payload) {
      if (payload.actionType === SiteConstants.SITE_METADATA_RECEIVED) {
        SiteDataStore.storeMetaData(payload.sites);
      }
    }),

  });


}(this));
