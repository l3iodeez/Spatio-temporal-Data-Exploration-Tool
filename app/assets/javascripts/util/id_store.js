(function (root) {
  'use strict';
  var DataPortal = window.DataPortal = window.DataPortal || {};

  DataPortal.IdStore = function (opt) {
    this._selected = [];
    this.ids = [];
  };

  DataPortal.IdStore.prototype.store = function (id) {
    this.ids[id] = true;
    this.sortedInsert(id, this._selected);
  };

  DataPortal.IdStore.prototype.remove = function (id) {
    this.ids[id] = false;
    this.sortedRemove(id, this._selected);
  };

  DataPortal.IdStore.prototype.isSelected = function (id) {
    if (this.ids[id]) {
      return true;
    } else {
      return false;
    }
  };

  DataPortal.IdStore.prototype.selectedIds = function (id) {
    return this._selected;
  };

  DataPortal.IdStore.prototype.sortedInsert = function (element, array) {
    array.splice(this.locationOf(element, array) + 1, 0, element);
  };

  DataPortal.IdStore.prototype.sortedRemove = function (element, array) {
    array.splice(this.locationOf(element, array), 1);
  };

  DataPortal.IdStore.prototype.locationOf = function (element, array, start, end) {
    start = start || 0;
    end = end || array.length;
    var pivot = parseInt(start + (end - start) / 2, 10);
    if (end - start <= 1 || array[pivot] === element) return pivot;
    if (array[pivot] < element) {
      return this.locationOf(element, array, pivot, end);
    } else {
      return this.locationOf(element, array, start, pivot);
    }
  };

  DataPortal.IdStore.prototype.loadSelection = function (ids) {
    this._selected = [];
    this.ids = [];
    ids.forEach(function (id) {
      this.store(id);
    }.bind(this));
  };
}(this));
