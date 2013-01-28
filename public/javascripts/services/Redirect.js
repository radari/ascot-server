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
    factory('$redirect', ['$window', '$location', function($window, $location) {
      return function(url) {
        // First one only for sake of E2E testing working. Second one is for
        // actual redirect
        $location.url(url);
        $window.location.href = url;
      };
    }]);
