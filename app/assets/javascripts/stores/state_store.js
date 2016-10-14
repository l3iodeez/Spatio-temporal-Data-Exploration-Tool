(function (root) {
  'use strict';
  var _selectedSites = new WaterData.IdStore;
  var _heldKeys = new WaterData.IdStore;

  var EVENTS = [StateConstants.EVENTS.SITE_SELECT_CHANGE, StateConstants.EVENTS.HELD_KEYS_CHANGE];

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

      this._selectionChanged();
    },

    removeSites: function (siteIds) {
      siteIds.forEach(function (siteId) {
        _selectedSites.remove(siteId);
      });

      this._selectionChanged();
    },

    selectSite: function (siteId) {
      _selectedSites.store(siteId);
      this._selectionChanged();
    },

    removeSite: function (siteId) {
      _selectedSites.remove(siteId);
      this._selectionChanged();
    },

    selectedSites: function () {
      return _selectedSites.selectedIds();
    },

    isSelected: function (siteId) {
      return _selectedSites.isSelected(siteId);
    },

    _selectionChanged: function () {
      this.emit(StateConstants.EVENTS.SITE_SELECT_CHANGE);
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
  });

}(this));
