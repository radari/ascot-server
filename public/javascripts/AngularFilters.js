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
  }).filter('checkEmpty', function() {
    return function(input, def) {
      if (!input || input.length == 0) {
        return def;
      }
      return input;
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
  }).filter('htmlifyTags', function() {
    return function(look) {
      var ret = look.title;
      ret += (look.source.length > 0 ? "\n<br>\nSource: " + look.source : "");
      ret += "\n<br>\n<br>\n";
      for (var i = 0; i < look.tags.length; ++i) {
        var tag = look.tags[i];
        ret += (i > 0 ? "\n<br>\n" : "");
        ret += "<a href='" + tag.product.buyLink + "'>" + 
            "<b>" + tag.product.brand + "</b> " + tag.product.name +
            "</a>"; 
      };
      return ret;
    };
  });
