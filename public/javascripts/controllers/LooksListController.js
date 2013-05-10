/**
 *  LooksListController.js
 *
 *  Created on: February 21, 2013
 *      Author: Valeri Karpov
 *
 *  Controller for looks list - sorting, filtering, pagination.
 *
 */
 
function LooksListController($scope, $http, $window) {
  $scope.looks = [];
  $scope.columns = [];
  $scope.columnHeights = [];
  $scope.numLoaded = 0;
  $scope.numPages = 0;
  $scope.currentPage = 0;
  $scope.nextPage = 0;
  $scope.$window = $window;

  /*$scope.opts = {
    backdrop: true,
    keyboard: true,
    backdropClick: true,
    template: '<iframe src="/look/513032623e92dee93b00002e/iframe" style="height: 800px; width: 800px;" />'
  };

  $scope.randomLook = function() {
    $http.get('/random', { headers : { accept : 'application/json' } }).
        success(function(look) {
          var width = Math.min(560, look.size.width);
          var height = (width == look.size.width ? look.size.height : look.size.height * (width / look.size.width));
          $scope.opts.template = '<iframe src="/look/' + look._id + '/iframe" style="height: ' + height + 'px; width: ' + width + 'px;" />';
          $dialog.dialog($scope.opts).open();
        });
  };*/
  
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
      ++$scope.nextPage;
      $http.get('/all?p=' + $scope.nextPage, { headers : { accept : 'application/json' } })
          .success(
            function(data) {
              addLooks(data.looks);
            });
    }
  };
  
}
