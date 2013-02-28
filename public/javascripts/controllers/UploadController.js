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
  alert('x');
  $scope.url = "";
  $scope.path = "";

  $scope.shouldShow = function() {
    return $scope.url.length > 0 || $scope.path.length > 0;
  };

  UploadController.prototype.$scope = $scope;
}

UploadController.prototype.setPath = function(path) {
  alert(path);
  var $scope = this.$scope;
  $scope.$apply(function() {
    $scope.path = path;
  });
}