(function (root) {
  'use strict';

  var ApiActions = root.ApiActions = {
    receiveSiteMetadata: function (sites) {
      AppDispatcher.dispatch({
        actionType: SiteConstants.SITE_METADATA_RECEIVED,
        sites: sites,
      });
    },

    receiveSeriesData: function (series) {
      AppDispatcher.dispatch({
        actionType: SiteConstants.SERIES_DATA_RECEIVED,
        series: series,
      });
    },
  };
}(this));
