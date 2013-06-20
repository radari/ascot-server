/*
 *  MainSearchBarController.js
 *
 *  Created on: January 25, 2012
 *      Author: Valeri Karpov
 *
 *  Controller for the main search bar in layout.jade
 *
 */

function MainSearchBarController($scope, $autocomplete, $redirect) {
  $scope.mainSearch = "";
  $scope.autocomplete = $autocomplete;
  $autocomplete.setUrl('MAIN', '/filters.json');

  $scope.updateResults = function() {
    $autocomplete.updateResults('MAIN', { query : $scope.mainSearch });
  };
  
  $scope.filterToString = function(filter) {
    if (filter.type == 'Brand') {
      return filter.v + ' (Brand)';
    } else if (filter.type == 'Keyword') {
      return 'Search for ' + filter.v;
    } else if (filter.type == 'Name') {
      return filter.brand + ' ' + filter.name + ' (Product)';
    } else {
      alert('Invalid filter');
    }
  };

  $scope.onSelected = function(filter) {
    if (filter.type == 'Brand') {
      $redirect('/brand?v=' + encodeURIComponent(filter.v));
    } else if (filter.type == 'Keyword') {
      $redirect('/keywords?v=' + encodeURIComponent(filter.v));
    } else if (filter.type == 'Name') {
      $redirect('/product?brand=' + encodeURIComponent(filter.brand) + '&name=' + encodeURIComponent(filter.name));
    } else {
      alert('Invalid filter');
    }
  };
}
