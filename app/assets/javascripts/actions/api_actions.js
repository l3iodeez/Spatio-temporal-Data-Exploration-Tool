(function (root) {
  'use strict';

  // note api functions
  var ApiActions = root.ApiActions = {
    receiveSiteMetadata: function(sites){
      AppDispatcher.dispatch({
        actionType: SiteConstants.SITE_METADATA_RECEIVED,
        sites: sites
      });
    },
    receiveSite: function(site_data){
      AppDispatcher.dispatch({
        actionType: SiteConstants.SITE_DATA_RECEIVED,
        sites: sites
      });
    },
    receiveSites: function(site_data){
      AppDispatcher.dispatch({
        actionType: SiteConstants.SITES_DATA_RECEIVED,
        sites: sites
      });
    },
  // sessions api functions


  };
}(this));
