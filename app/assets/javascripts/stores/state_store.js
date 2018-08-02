(function (root) {
  'use strict';
  var _selectedSites = new WaterData.IdStore;
  var _savedSelections = {};
  var _heldKeys = new WaterData.IdStore;
  var _loginData = {};
  var _authToken = $("meta[name='csrf-token']").attr('content');


  var EVENTS = [
    StateConstants.EVENTS.SITE_SELECT_CHANGE,
    StateConstants.EVENTS.HELD_KEYS_CHANGE,
    StateConstants.EVENTS.SAVED_SELECTIONS_CHANGE,
    StateConstants.EVENTS.LOGIN_STATE_CHANGE,
  ];

  root.StateStore = $.extend({}, EventEmitter.prototype, {

    addChangeListener: function (eventType, callback) {
      if (EVENTS.includes(eventType)) {
        this.on(eventType, callback);
      } else {
        throw "Invalid event type '" + eventType + "'.";
      }
    },

    removeChangeListener: function (eventType, callback) {
      this.removeListener(eventType, callback);
    },

    toggleSite: function (siteId) {
      if (_selectedSites.isSelected(siteId)) {
        this.removeSite(siteId);
      } else {
        this.selectSite(siteId);
      }
    },

    selectSites: function (siteIds) {
      siteIds.forEach(function (siteId) {
        _selectedSites.store(siteId);
      });

      this._selectionChanged(siteIds, []);
    },

    removeSites: function (siteIds) {
      siteIds.forEach(function (siteId) {
        _selectedSites.remove(siteId);
      });

      this._selectionChanged([], siteIds);
    },

    selectSite: function (siteId) {
      _selectedSites.store(siteId);
      this._selectionChanged([siteId], []);
    },

    removeSite: function (siteId) {
      _selectedSites.remove(siteId);
      this._selectionChanged([], [siteId]);
    },

    selectedSites: function () {
      return _selectedSites.selectedIds();
    },

    isSelected: function (siteId) {
      return _selectedSites.isSelected(siteId);
    },

    _selectionChanged: function (added, removed) {
      this.emit(StateConstants.EVENTS.SITE_SELECT_CHANGE, added, removed);
    },

    keyDown: function (keyId) {
      _heldKeys.store(keyId);
      this._keysChanged(keyId, StateConstants.EVENTS.KEYDOWN);
    },

    keyUp: function (keyId) {
      _heldKeys.remove(keyId);
      this._keysChanged(keyId, StateConstants.EVENTS.KEYUP);
    },

    heldKeys: function () {
      return _heldKeys.selectedIds();
    },

    isHeld: function (keyId) {
      return _heldKeys.isSelected(keyId);
    },

    _keysChanged: function (keyId, changeType) {
      this.emit(StateConstants.EVENTS.HELD_KEYS_CHANGE, keyId, changeType);
    },

    saveSelection: function (siteIds, name) {
      if (!siteIds) {
        return;
      }

      _savedSelections[name] = siteIds;
      this.emit(StateConstants.EVENTS.SAVED_SELECTIONS_CHANGE, _savedSelections);
    },

    savedSelections: function () {
      return _savedSelections;
    },

    loadSelection: function (ids) {
      var removedIds = _selectedSites.selectedIds().slice(0);
      _selectedSites.loadSelection(ids);
      this._selectionChanged(ids, removedIds);
    },

    deleteSavedSelection: function (name) {
      delete _savedSelections[name];
      this.emit(StateConstants.EVENTS.SAVED_SELECTIONS_CHANGE, _savedSelections);
    },

    updateSavedSelections: function () {
      ApiUtil.getSavedSelections.bind(this)(function (savedSelections) {
        _savedSelections = savedSelections;
        this.emit(StateConstants.EVENTS.SAVED_SELECTIONS_CHANGE, _savedSelections);
      }.bind(this));
    },

    logoutCleanup: function () {
      this.emit(StateConstants.EVENTS.SITE_SELECT_CHANGE, [], _selectedSites.selectedIds());
      _selectedSites = new WaterData.IdStore;
      _savedSelections = {};
      _loginData = {};
      this.emit(StateConstants.EVENTS.SAVED_SELECTIONS_CHANGE, _savedSelections);
      this.emit(StateConstants.EVENTS.LOGIN_STATE_CHANGE, _loginData);
    },

    authToken: function () {
      return _authToken;
    },

    loginData: function () {
      return _loginData;
    },

    updateLoginState: function (loginData) {
      _loginData = loginData;
      if (!loginData.loggedIn) {
        this.logoutCleanup()
      }
      this.emit(StateConstants.EVENTS.LOGIN_STATE_CHANGE, _loginData);
    },

    dispatcherId: AppDispatcher.register(function (payload) {
      if (payload.actionType === StateConstants.LOGIN_STATE_CHANGE) {
        _authToken = payload.loginData.authToken;
        StateStore.updateLoginState(payload.loginData);
      } else if (payload.actionType === StateConstants.SAVED_SELECTIONS_CHANGE) {
        _authToken = payload.loginData.authToken;
      }
    }),
  });

}(this));
