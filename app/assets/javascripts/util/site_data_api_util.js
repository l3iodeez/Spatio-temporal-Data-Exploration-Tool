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
  };
}(this));
