(function (root) {
  'use strict';
  var ApiUtil = root.ApiUtil = {
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
            callback(SiteDataStore.seriesData(Array.from(new Set(siteIds.concat(ids)))));
          }
        },
      });
    },

    signIn: function (email, password, authToken, callback) {
      $.ajax({
        url: '/users/sign_in',
        method: 'POST',
        data: {
          user: {
            email: email,
            password: password,
          },
          remember_me: true,
          authenticity_token: authToken,
        },
        dataType: 'json',
        success: function (data) {
          ApiActions.loginStateChange(data);
          if (typeof callback === 'function') {
            callback(data);
          }
        },

        fail: function (data) {
          ApiActions.loginStateChange(data);
          if (typeof callback === 'function') {
            callback(data);
          }
        },
      });
    },

    signOut: function (authToken, callback) {
      $.ajax({
        url: '/users/sign_out',
        method: 'DELETE',
        data: { authenticity_token: authToken },
        success: function (data) {
          ApiActions.loginStateChange(data);
          if (typeof callback === 'function') {
            callback(data);
          }
        },
      });
    },

    getSavedSelections: function (callback) {
      $.ajax({
        url: '/api/saved_selections',
        method: 'GET',
        success: function (data) {
          if (typeof callback === 'function') {
            callback(data);
          }
        },
      });
    },

    saveSelections: function (selectionArray, authToken, callback) {
      $.ajax({
        url: '/api/save_selections',
        method: 'POST',
        data: { selections: selectionArray, authenticity_token: authToken },
        dataType: 'json',
        success: function (data) {
          if (typeof callback === 'function') {
            callback(data);
          }
        },
      });
    },
  };
}(this));
