/*
 *  CollectionController.js
 *
 *  Created on: May 20, 2013
 *      Author: Valeri Karpov
 *
 *  Controller for displaying a collection
 *
 */

function CollectionController($scope, $http, $window) {
  $scope.collection = {};
  $scope.currentPage = 0;

  $scope.init = function(collection) {
    $scope.collection = collection;
  };
  
  $scope.getWindowSize = function() {
    return { height : $window.height(), width : $window.width() };
  };
}
