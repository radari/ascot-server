/*
 *  TaggerViewController.js
 *
 *  Created on: December 5, 2012
 *      Author: Valeri Karpov
 *
 *  Front-end controller for adding / deleting tags on an image
 *
 */

function TaggerViewController($scope, $http, ImageOffsetService) {
  this.$scope = $scope;

  $scope.idsToLooks = {};

  // Initial load of look
  $scope.loadLook = function(id) {
    $scope.idsToLooks[id] = { _id : id, tags : [] };
    $http.get('/tags.jsonp?id=' + encodeURIComponent(id)).success(function(look) {
      $scope.idsToLooks[id] = look;
    }).error(function(error) { alert(error); });
  };

  // Add a tag
  $scope.addTag = function(id, pageX, pageY) {
    var offset = ImageOffsetService.getOffset(id);
    alert(JSON.stringify(offset));
    $scope.idsToLooks[id].tags.push({ index : $scope.idsToLooks[id].tags.length, position : { x : (pageX - offset.x), y : (pageY - offset.y) } });
  };
}
