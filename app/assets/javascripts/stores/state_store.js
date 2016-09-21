(function (root) {
  'use strict';
  var _selectedSites = new WaterData.IdStore;
  var _heldKeys = new WaterData.IdStore;
  var SELECTED_SITE_CHANGE_EVENT = 'siteSelectChange';
  var HELD_KEYS_CHANGE_EVENT = 'siteSelectChange';

  var EVENTS = [SELECTED_SITE_CHANGE_EVENT, HELD_KEYS_CHANGE_EVENT];

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
      this.emit(SELECTED_SITE_CHANGE_EVENT);
    },

    keyDown: function (keyId) {
      _heldKeys.store(keyId);
      this._keysChanged();
    },

    keyUp: function (keyId) {
      _heldKeys.remove(keyId);
      this._keysChanged();
    },

    heldKeys: function () {
      return _heldKeys.selectedIds();
    },

    isHeld: function (keyId) {
      return _heldKeys.isSelected(keyId);
    },

    _keysChanged: function () {
      this.emit(HELD_KEYS_CHANGE_EVENT);
    },
  });

}(this));
