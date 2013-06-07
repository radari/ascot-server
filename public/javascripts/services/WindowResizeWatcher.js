/*
 *  WindowResizeWatcher.js
 *
 *  Created on: June 3, 2013
 *      Author: Valeri Karpov
 *
 *  Service that notifies you when the window has been resized
 *
 */

angular.module('WindowModule', []).
    factory('$resizeWatcher', [function($scope, $http) {
      var watcher = function() {
        this.callbacks = [];

        this.addCallback = function(callback) {
          this.callbacks.push(callback);
        };

        $(window).resize(function() {
          for (var i = 0; i < this.callbacks.length; ++i) {
            this.callbacks[i]();
          };
        });
      };

      return new watcher();
    }]);