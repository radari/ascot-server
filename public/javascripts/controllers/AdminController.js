/*
 *  MainSearchBarController.js
 *
 *  Created on: February 20, 2013
 *      Author: Matt Green
 *
 *  Controller for admin panel
 *
 */

function AdminController($scope){
  
  $scope.togglePublished = function() {
    if($scope.isPublished === "published"){
      $scope.isPublished = "unpublished";
    } else {
      $scope.isPublished = "published";
    }
  };

}