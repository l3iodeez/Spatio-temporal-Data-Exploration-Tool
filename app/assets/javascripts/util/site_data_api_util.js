(function(root) {
  'use strict';
  var NotesAPIUtil = root.NotesAPIUtil = {
    fetchSiteMetadata: function (callback) {
      $.ajax({
        url: '/api/sites',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          ApiActions.receiveSiteMetadata(data);
          if (typeof callback === "function") {
           callback(data);
          }
        }
      });
    }
  };
}(this));
