/**
 *  UploadController.js
 *
 *  Created on: February 28, 2013
 *      Author: Valeri Karpov
 *
 *  Controller for upload route
 *
 */

function UploadController($scope) {
  $scope.url = "";
  $scope.path = "";

  $scope.shouldShow = function() {
    return $scope.url.length > 0 || $scope.path.length > 0;
  };

  // TODO: Hack alert! Borrowed from http://jsfiddle.net/marcenuc/ADukg/49/
  // However this is very bad practice in Angular - global state is nasty
  UploadController.prototype.$scope = $scope;
}

UploadController.prototype.setPath = function(path) {
  var $scope = this.$scope;
  $scope.$apply(function() {
    $scope.path = path;
  });
}