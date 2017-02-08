(function (root) {
  'use strict';
  var SitesAPIUtil = root.SitesAPIUtil = {
    fetchSiteMetadata: function (callback) {
      $.ajax({
        url: '/api/sites',
        method: 'GET',

        success: function (data) {
          ApiActions.receiveSiteMetadata(data);
          if (typeof callback === 'function') {
            callback(data);
          }
        },
      });
    },

    fetchSeriesData: function (pullIds, callback, siteIds) {
      $.ajax({
        url: '/api/series',
        method: 'POST',
        data: { pullIds: pullIds },
        dataType: 'json',
        success: function (data) {
          ApiActions.receiveSeriesData(data);
          var ids = pullIds;
          if (typeof callback === 'function') {
            // var pulledData = SiteDataStore.transformData(data);
            callback($.extend(SiteDataStore.seriesData(siteIds), data));
          }
        },
      });
    },
  };
}(this));
