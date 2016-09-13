(function (root) {
  'use strict';
  if (!Array.prototype.includes) {
    Array.prototype.includes = function (element) {
      var array = this.slice(0);
      for (var i = 0; i < array.length; i++) {
        if (element === array[i]) {
          return true;
        }
      }

      return false;
    };
  }

  if (!Array.prototype.find) {
    Array.prototype.find = function (callback) {
      var array = this.slice(0);
      for (var i = 0; i < array.length; i++) {
        if (callback(array[i])) {
          return array[i];
        }
      }
    };
  }

  //==========================
  // Array indexOf
  // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
        if (this === null) {
          throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
          return -1;
        }

        var n = 0;
        if (arguments.length > 1) {
          n = Number(arguments[1]);
          if (n != n) { // shortcut for verifying if it's NaN
            n = 0;
          } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
            n = (n > 0 || -1) * Math.floor(Math.abs(n));
          }
        }

        if (n >= len) {
          return -1;
        }

        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
          if (k in t && t[k] === searchElement) {
            return k;
          }
        }

        return -1;
      };
  }

  var WaterData = window.WaterData = window.WaterData || {};

  WaterData.inherits = function (ChildClass, ParentClass) {
    var Surrogate = function () {};

    Surrogate.prototype = ParentClass.prototype;
    ChildClass.prototype = new Surrogate();
    ChildClass.prototype.constructor = ChildClass;
  };

}(this));
