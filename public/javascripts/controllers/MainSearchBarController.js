/*
 *  MainSearchBarController.js
 *
 *  Created on: January 25, 2012
 *      Author: Valeri Karpov
 *
 *  Controller for the main search bar in layout.jade
 *
 */

function MainSearchBarController($scope, $http, $redirect) {
  $scope.mainSearch = "";
  $scope.results = [];
  $scope.suggestions = [];
  $scope.currentSelection = 0;

  $scope.updateResults = function() {
    if ($scope.mainSearch.length >= 2) {
      $http.get('/filters.json?query=' +
          encodeURIComponent($scope.mainSearch)).
          success(function(data) {
            $scope.results = data.data;
            $scope.suggestions = data.suggestions;
          });
    } else {
      $scope.results = [];
      $scope.suggestions = [];
    }
  };
  
  $scope.prevSelection = function() {
    if ($scope.results.length == 0) {
      return;
    }
  
    if ($scope.currentSelection == 0) {
      $scope.currentSelection = $scope.results.length - 1;
    } else {
      --$scope.currentSelection;
    }
  };
  
  $scope.nextSelection = function() {
    if ($scope.results.length == 0) {
      return;
    }
  
    if ($scope.currentSelection == $scope.results.length - 1) {
      $scope.currentSelection = 0;
    } else {
      ++$scope.currentSelection;
    }
  };
  
  $scope.checkSelection = function(index) {
    if ($scope.currentSelection == index) {
      return 'selection';
    }
    return '';
  };

  $scope.onSelected = function(filter) {
    if (filter.type == 'Brand') {
      $redirect('/brand?v=' + encodeURIComponent(filter.v));
    } else if (filter.type == 'Keyword') {
      $redirect('/keywords?v=' + encodeURIComponent(filter.v));
    } else {
      alert('Invalid filter');
    }
  };
}
