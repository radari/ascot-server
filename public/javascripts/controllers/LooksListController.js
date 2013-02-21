/**
 *  LooksListController.js
 *
 *  Created on: February 21, 2013
 *      Author: Valeri Karpov
 *
 *  Controller for looks list - sorting, filtering, pagination.
 *
 */
 
function LooksListController($scope) {
  var PER_ROW = 5;
  var ROW_WIDTH = 780;
  
  $scope.looks = [];
  $scope.rows = [];
  $scope.numPages = 0;
  $scope.currentPage = 0;
  
  $scope.$R = function(low, high) {
    var ret = [];
    for (var i = low; i < high; ++i) {
      ret.push(i);
    }
    return ret;
  };
  
  $scope.conditional = function(b, t, f) {
    return b ? t : f;
  };

  $scope.init = function(looks, numPages, currentPage) {
    $scope.looks = looks;
    $scope.numPages = numPages;
    $scope.currentPage = currentPage;
    
    // TODO: make this a service, right now doing a DI reacharound
    $scope.sizer = exports.createLookImageSizer($scope.looks, PER_ROW, ROW_WIDTH);
    
    var row = -1;
    for (var i = 0; i < looks.length; ++i) {
      looks[i].index = i;
      if (i % PER_ROW == 0) {
        ++row;
        $scope.rows.push([]);
      }
      $scope.rows[row].push(looks[i]);
    }
  };
  
  
}
