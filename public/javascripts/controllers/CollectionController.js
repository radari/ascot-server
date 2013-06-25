/*
 *  CollectionController.js
 *
 *  Created on: May 20, 2013
 *      Author: Valeri Karpov
 *
 *  Controller for displaying a collection
 *
 */

function CollectionController($scope, $http, $window, $timeout, $windowSize, $isMobile) {
  $scope.collection = {};
  $scope.currentPage = 0;
  $scope.hideDirectional = $isMobile;
  
  // Small hack to make sure Angular is aware of page resizes
  $windowSize.resize(function() {
    $scope.$apply();
  });

  $scope.init = function(collection) {
    $scope.collection = collection;
  };
  
  $scope.getWindowSize = function() {
    return $windowSize.getWindowSize();
  };

  var oldHeight = 0;
  var oldWidth = 0;
  $scope.getImageStyle = function(look) {
    var windowHeight = $windowSize.getWindowSize().height;
    var windowWidth = $windowSize.getWindowSize().width;
    var fullscreenWidth = (windowHeight / look.size.height) * look.size.width;
    
    // Make sure that we notify of image resize
    if (windowHeight != oldHeight || windowWidth != oldWidth) {
      $timeout(function() {
        $window.ascotPlugin.resizeAll();
      }, 150);
    }
    
    oldHeight = windowHeight;
    oldWidth = windowWidth;
    if (fullscreenWidth < windowWidth) {
      return { height : windowHeight + 'px', 'margin-top' : '0px', width : fullscreenWidth + 'px' };
    } else {
      var h = Math.floor((windowWidth / look.size.width) * look.size.height);
      return { height : h + 'px', 'margin-top' : '0px', width : windowWidth + 'px' };
    }
  };
}
