/*
 *  TaggerViewController.js
 *
 *  Created on: December 5, 2012
 *      Author: Valeri Karpov
 *
 *  Front-end controller for adding / deleting tags on an image
 *
 */

var TaggerViewController = function($scope, $http) {
  this.$scope = $scope;

  var self = this;
  self.idsToLooks = {};

  this.loadLook = function(id) {
    $http.get('/tags.jsonp?id=' + encodeURIComponent(id)).success(function(look) {
      self.idsToLooks[id] = look;
    });
  };
};
