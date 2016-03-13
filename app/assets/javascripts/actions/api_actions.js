(function(root) {
  'use strict';

  // note api functions
  var ApiActions = root.ApiActions = {
    receiveSiteMetadata: function(sites){
      AppDispatcher.dispatch({
        actionType: SiteConstants.RECEIVE_SITE_METADATA,
        sites: sites
      });
    },

  // sessions api functions


  };
}(this));
