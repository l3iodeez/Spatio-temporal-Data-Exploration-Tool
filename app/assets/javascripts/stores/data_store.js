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
      _sites = sites;
    },
    siteMetaData: function () {
      return _sites;
    },
    dispatcherId: AppDispatcher.register(function (payload) {
      if (payload.actionType === SiteConstants.RECEIVE_SITE_METADATA) {
        SiteDataStore.storeMetaData(payload.sites);
      }
    }),

  });


}(this));
