(function (root) {
  'use strict';
  var WaterData = window.WaterData = window.WaterData || {};

  WaterData.IdStore = function (opt) {
    this._selected= [];
    this.ids = [];
  };

  WaterData.IdStore.prototype.store = function (id) {
    this.ids[id] = true;
    this.sortedInsert(id, this._selected);
  };

  WaterData.IdStore.prototype.remove = function (id) {
    this.ids[id] = false;
    this.sortedRemove(id, this._selected);
  };

  WaterData.IdStore.prototype.isSelected = function (id) {
    if (this.ids[id]) {
      return true;
    } else {
      return false;
    }
  };

  WaterData.IdStore.prototype.selectedIds = function (id) {
    return this._selected;
  };

  WaterData.IdStore.prototype.sortedInsert = function (element, array) {
    array.splice(this.locationOf(element, array) + 1, 0, element);
    return array;
  };

  WaterData.IdStore.prototype.sortedRemove = function (element, array) {
    array.splice(this.locationOf(element, array) + 1, 0);
    return array;
  };

  WaterData.IdStore.prototype.locationOf = function (element, array, start, end) {
    start = start || 0;
    end = end || array.length;
    var pivot = parseInt(start + (end - start) / 2, 10);
    if (end-start <= 1 || array[pivot] === element) return pivot;
    if (array[pivot] < element) {
      return this.locationOf(element, array, pivot, end);
    } else {
      return this.locationOf(element, array, start, pivot);
    }
  };
}(this));
