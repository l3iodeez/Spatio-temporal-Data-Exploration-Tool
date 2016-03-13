(function(root) {
  'use strict';
  var _modal = null;
  var CHANGE_EVENT = "modalChange";

  root.ModalStore = $.extend({}, EventEmitter.prototype, {



    addChangeListener: function(callback){
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback){
      this.removeListener(CHANGE_EVENT, callback);
    },


    dispatcherId: AppDispatcher.register(function (payload) {

    }),

  });


}(this));
