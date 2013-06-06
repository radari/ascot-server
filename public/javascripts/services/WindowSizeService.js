/*
 *  WindowSizeService.js
 *
 *  Created on: June 6, 2012
 *      Author: Valeri Karpov
 *
 *  Angular interface for getting and watching window size
 *
 */

angular.module('WindowSizeService', []).
    factory('$windowSize', [function() {
      return {
        resize : function(callback) {
          $(window).resize(callback);
        },
        getWindowSize : function() {
          return { height : $(window).height(), width : $(window).width() };
        }
      };
    }]);
