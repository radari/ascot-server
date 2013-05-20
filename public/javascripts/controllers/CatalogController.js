/*
 *  CatalogController.js
 *
 *  Created on: May 20, 2013
 *      Author: Valeri Karpov
 *
 *  Controller for displaying a catalog
 *
 */

function CatalogController($scope, $http) {
  $scope.catalog = {};

  $scope.init = function(catalog) {
    $scope.catalog = catalog;
  };
}