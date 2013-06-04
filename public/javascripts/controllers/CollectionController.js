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
  
  // Small hack to make sure Angular is aware of page resizes
  $(window).resize(function() {
    $scope.$apply();
  });

  $scope.init = function(collection) {
    $scope.collection = collection;
  };
  
  $scope.getWindowSize = function() {
    return { height : $(window).height(), width : $(window).width() };
  };

  var oldHeight = 0;
  var oldWidth = 0;
  $scope.getImageHeight = function(look, $element) {
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    var fullscreenWidth = (windowHeight / look.size.height) * look.size.width;
    
    // Make sure that we notify of image resize
    if ($element && (windowHeight != oldHeight || windowWidth != oldWidth)) {
      $timeout(function() {
        alert('t3');
        $element.resize();
      }, 150);
    }
    
    oldHeight = windowHeight;
    oldWidth = windowWidth;
    if (fullscreenWidth < windowWidth) {
      return windowHeight;
    } else {
      return Math.floor((windowWidth / look.size.width) * look.size.height);
    }
  };

  $scope.getImageMarginTop = function(look) {
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    var fullscreenWidth = (windowHeight / look.size.height) * look.size.width;
    if (fullscreenWidth < windowWidth) {
      return 0;
    } else {
      var h = Math.floor((windowWidth / look.size.width) * look.size.height);
      return Math.floor((windowHeight - h) / 2);
    }
  };
}
