/*
 *  CollectionController.js
 *
 *  Created on: May 20, 2013
 *      Author: Valeri Karpov
 *
 *  Controller for displaying a collection
 *
 */

function CollectionController($scope, $http, $window, $timeout) {
  $scope.collection = {};
  $scope.currentPage = 0;

  $scope.init = function(collection) {
    $scope.collection = collection;
  };
  
  $scope.getWindowSize = function() {
    return { height : $(window).height(), width : $(window).width() };
  };

  $scope.getImageHeight = function(look) {
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    var fullscreenWidth = (windowHeight / look.size.height) * look.size.width;
    if (fullscreenWidth < windowWidth) {
      return windowHeight;
    } else {
      return Math.floor((windowWidth / look.size.width) * look.size.height);
    }
  };
}
