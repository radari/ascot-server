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
        this.selection = {};

        this.setUrl = function(tag, url) {
          this.texts[tag] = "";
          this.urls[tag] = url;
          this.results[tag] = [];
          this.show[tag] = true;
          this.selection[tag] = 0;
        };

        this.updateResults = function(tag, text) {
          if (text.length < 1) {
            this.results[tag] = [];
            return;
          }
          this.texts[tag] = text;
          this.show[tag] = true;
          this.selection[tag] = 0;
          if (this.urls[tag]) {
            $http.get(this.urls[tag] + '?query=' + encodeURIComponent(text)).
                success(function(data) {
                  self.results[tag] = data;
                }).error(function(data, status) {
                  alert('--> ' + data + " " + status);
                });
          } else {
            this.results[tag] = [];
          }
        };
        
        this.hide = function(tag) {
          this.show[tag] = false;
        };
        
        this.nextSelection = function(tag) {
          if (this.results[tag].length == 0) {
            return;
          }
          this.selection[tag] = (this.selection[tag] + 1) % (this.results[tag].length);
        };
        
        this.prevSelection = function(tag) {
          if (this.results[tag].length == 0) {
            return;
          }
          
          if (this.selection[tag] == 0) {
            this.selection[tag] = (this.results[tag].length - 1);
          } else {
            this.selection[tag] = (this.selection[tag] - 1);
          }
        };
        
        this.setSelection = function(tag, index) {
          this.selection[tag] = index % (this.results[tag].length);
        };
        
        this.checkSelection = function(tag, index) {
          if (this.selection[tag] == index) {
            return 'selection';
          }
          return '';
        };
        
        this.getSelected = function(tag) {
          if (this.results[tag].length == 0) {
            return '';
          }
          return this.results[tag][this.selection[tag]];
        };
      };

      return new $autocomplete();
    }]);

