/*
 *  AngularFilters.js
 *
 *  Created on: December 9, 2012
 *      Author: Valeri Karpov
 *
 *  A couple often-used filters for Angular
 *
 */

angular.module('AngularFilters', []).
  filter('boldInstances', function() {
    return function(input, search) {
      var index = input.toLowerCase().indexOf(search.toLowerCase());
      if (index == -1) {
        return input;
      } else {
        var ret = "";
        ret = input.substring(0, index) + "<b>" + input.substring(index, index + search.length) + "</b>" + input.substring(index + search.length);
        return ret;
      }
    };
  }).filter('concat', function() {
    return function(lhs, rhs) {
      return lhs + rhs;
    }
  }).filter('wrap', function() {
    return function(input, left, right) {
      return left + input + right;
    }
  }).filter('encodeURIComponent', function() {
    return encodeURIComponent;
  });
