(function (root) {
  'use strict';
  var _selectedSites = new WaterData.IdStore;
  var SELECTED_SITE_CHANGE_EVENT = 'siteSelectChange';
  var EVENTS = [SELECTED_SITE_CHANGE_EVENT];

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
  });

}(this));
