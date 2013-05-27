/**
 *  LooksListController.js
 *
 *  Created on: February 21, 2013
 *      Author: Valeri Karpov
 *
 *  Controller for looks list - sorting, filtering, pagination.
 *
 */
 
function LooksListController($scope, $http, $window, $timeout) {
  $scope.looks = [];
  $scope.columns = [];
  $scope.columnHeights = [];
  $scope.numLoaded = 0;
  $scope.numPages = 0;
  $scope.currentPage = 0;
  $scope.nextPage = 0;
  $scope.$window = $window;
  
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
      var minHeightColumn = 0;
      for (var j = 1; j < $scope.numColumns; ++j) {
        if ($scope.columnHeights[j] < $scope.columnHeights[minHeightColumn]) {
          minHeightColumn = j;
        }
      }
      $window.looksListAscotPlugin.setDataForLook(looks[i]._id, { hasUpvotedCookie : false, look : looks[i] });
      $scope.columns[minHeightColumn].push(looks[i]);
      $scope.columnHeights[minHeightColumn] += $scope.computeHeight(looks[i]);
      $scope.looks.push(looks[i]);
    }
  };
  
  $scope.computeHeight = function(look) {
    return look.size.height && look.size.width ?
        look.size.height * ($scope.columnWidth / look.size.width) : 0;
  };

  $scope.init = function(looks, numPages, currentPage, numColumns, columnWidth) {
    $scope.numPages = numPages;
    $scope.currentPage = currentPage;
    $scope.nextPage = currentPage + 1;
    $scope.numColumns = numColumns;
    $scope.columnWidth = columnWidth;

    for (var i = 0; i < numColumns; ++i) {
      $scope.columns.push([]);
      $scope.columnHeights.push(0);
    }
    
    addLooks(looks);
  };
  
  $scope.loadNextPage = function() {
    if ($scope.nextPage < $scope.numPages) {
      $http.get('/all?p=' + $scope.nextPage++, { headers : { accept : 'application/json' } })
          .success(
            function(data) {
              addLooks(data.looks);
            });
    }
  };

  $scope.setUpPlugin = function(id) {
    $timeout(function() {
      $window.ascotPluginEnqueue($('#ascot_' + id));
    }, 250);
  };
  
}
