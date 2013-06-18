/*
 *  BrowserFactsService.js
 *
 *  Created on: June 18, 2013
 *      Author: Valeri Karpov
 *
 *  Angular interface for determining if the browser is mobile or not
 *
 */

angular.module('AscotBrowserModule', []).
    factory('$isMobile', [function() {
      if ( /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ) {
        return true;
      }
      return false;
    }]);