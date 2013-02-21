/**
 *  LooksListController.js
 *
 *  Created on: February 21, 2013
 *      Author: Valeri Karpov
 *
 *  Controller for looks list - sorting, filtering, pagination.
 *
 */
 
function LooksListController($scope, $http) {
  var PER_ROW = 5;
  var ROW_WIDTH = 780;
  
  $scope.looks = [];
  $scope.rows = [];
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
      looks[i].index = i;
      if (i % PER_ROW == 0) {
        row = $scope.rows.length;
        $scope.rows.push([]);
      }
      $scope.rows[row].push(looks[i]);
    }
  };

  $scope.init = function(looks, numPages, currentPage) {
    $scope.looks = looks;
    $scope.numPages = numPages;
    $scope.currentPage = currentPage;
    $scope.nextPage = currentPage + 1;
    
    // TODO: make this a service, right now doing a DI reacharound
    $scope.sizer = exports.createLookImageSizer($scope.looks, PER_ROW, ROW_WIDTH);
    
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
