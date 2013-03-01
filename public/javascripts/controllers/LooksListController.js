/**
 *  LooksListController.js
 *
 *  Created on: February 21, 2013
 *      Author: Valeri Karpov
 *
 *  Controller for looks list - sorting, filtering, pagination.
 *
 */
 
function LooksListController($scope, $http, $timeout, $dialog) {
  
  $scope.looks = [];
  $scope.columns = [];
  $scope.numLoaded = 0;
  $scope.numPages = 0;
  $scope.currentPage = 0;
  $scope.nextPage = 0;
  
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

  var addLooks = function(looks) {
    var row = 0;
    for (var i = 0; i < looks.length; ++i) {
      $scope.columns[$scope.looks.length % $scope.numColumns].push(looks[i]);
      $scope.looks.push(looks[i]);
    }
  };

  $scope.init = function(looks, numPages, currentPage, numColumns) {
    $scope.numPages = numPages;
    $scope.currentPage = currentPage;
    $scope.nextPage = currentPage + 1;
    $scope.numColumns = numColumns;

    for (var i = 0; i < numColumns; ++i) {
      $scope.columns.push([]);
    }
    
    addLooks(looks);
  };
  
  $scope.loadNextPage = function() {
    if ($scope.nextPage < $scope.numPages) {
      ++$scope.nextPage;
      $http.get('/all?p=' + $scope.nextPage, { headers : { accept : 'application/json' } })
          .success(
            function(data) {
              addLooks(data.looks);
            });
    }
  };
  
}
