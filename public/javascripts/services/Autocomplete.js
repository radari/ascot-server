/**
 *  Autocomplete.js
 *
 *  Created on: February 4, 2012
 *      Author: Valeri Karpov
 *
 *  Service for handling basic autocompletes
 *
 */

angular.module('AutocompleteModule', []).
    factory('$autocomplete', ['$http', function($http) {
      var $autocomplete = function() {
      	var texts = {};
        var urls = {};

      	this.setText = function(tag, text) {
          texts[tag] = text;
      	};

        this.setUrl = function(tag, url) {
          urls[tag] = url;
        }

        this.updateResults = function(tag, text, callback) {
          texts[tag] = text;
          if (urls[tag]) {
            $http.get(urls[tag] + '?query=' + encodeURIComponent(text)).
                success(function(data) {
                  callback(data);
                });
          }
          $http.
        };
      };
    }]);