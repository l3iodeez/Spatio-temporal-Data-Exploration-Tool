(function (root) {
  'use strict';
  var WaterData = window.WaterData = window.WaterData || {};

  WaterData.IdStore = function (opt) {
    this.ids = [];
  };

  WaterData.IdStore.prototype.store = function (id) {
    this.ids[id] = true;
  };

  WaterData.IdStore.prototype.remove = function (id) {
    this.ids[id] = false;
  };

  WaterData.IdStore.prototype.isSelected = function (id) {
    if (this.ids[id]) {
      return true;
    } else {
      return false;
    }
  };

  WaterData.IdStore.prototype.selectedIds = function (id) {
    var selected = [];
    for (var i = 0; i < this.ids.length; i++) {
      if (this.isSelected(i)) {
        selected.push(i);
      }
    }

    return selected;
  };

}(this));
