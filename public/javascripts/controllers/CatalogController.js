/*
 *  CatalogController.js
 *
 *  Created on: May 20, 2013
 *      Author: Valeri Karpov
 *
 *  Controller for displaying a catalog
 *
 */

function CatalogController($scope, $http, $window) {
  $scope.catalog = {};
  $scope.currentPage = 0;

  $scope.init = function(catalog) {
    $scope.catalog = catalog;
  };
  
  $scope.getWindowSize = function() {
    return { height : $window.height(), width : $window.width() };
  };
}
