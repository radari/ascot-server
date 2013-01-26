/*
 *  Redirect.js
 *
 *  Created on: January 25, 2012
 *      Author: Valeri Karpov
 *
 *  Angular's $location service manages to fail at redirection, so use this
 *  instead.
 *
 */

angular.module('RedirectModule', []).
    factory('$redirect', [function() {
      // Abuse jQuery
      return function(url) {
        $(location).attr('href', url);
      };
    }]);