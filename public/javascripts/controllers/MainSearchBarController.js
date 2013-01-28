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
