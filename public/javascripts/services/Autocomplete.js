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
    factory('$autocomplete', ['$rootScope', '$http', function($scope, $http) {
      var $autocomplete = function() {
        var self = this;
      	this.texts = {};
        this.urls = {};
        this.results = {};
        this.show = {};

        this.setUrl = function(tag, url) {
          this.texts[tag] = "";
          this.urls[tag] = url;
          this.results[tag] = [];
          this.show[tag] = true;
        };

        this.updateResults = function(tag, text) {
          if (text.length < 2) {
            this.results[tag] = [];
            return;
          }
          this.texts[tag] = text;
          this.show[tag] = true;
          if (this.urls[tag]) {
            $http.get(this.urls[tag] + '?query=' + encodeURIComponent(text)).
                success(function(data) {
                  self.results[tag] = data;
                });
          } else {
            this.results[tag] = [];
          }
        };
        
        this.hide = function(tag) {
          this.show[tag] = false;
        };
      };

      return new $autocomplete();
    }]);
