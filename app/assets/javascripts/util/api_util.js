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

    signIn: function (email, password, callback) {
      $.ajax({
        url: '/users/sign_in',
        method: 'POST',
        data: {
          user: {
            email: email,
            password: password,
          },
          remember_me: true,
          authenticity_token: $("meta[name='csrf-token']").attr('content'),
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

    signOut: function (callback) {
      $.ajax({
        url: '/users/sign_out',
        method: 'DELETE',
        success: function () {
          ApiActions.loginStateChange({});
          if (typeof callback === 'function') {
            callback();
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

    saveSelections: function (selectionArray, callback) {
      $.ajax({
        url: '/api/save_selections',
        method: 'POST',
        data: { selections: selectionArray },
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
