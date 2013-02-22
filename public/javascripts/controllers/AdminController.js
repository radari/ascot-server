/*
 *  MainSearchBarController.js
 *
 *  Created on: February 20, 2013
 *      Author: Matt Green
 *
 *  Controller for admin panel
 *
 */

function AdminController($scope, $http){
  
  $scope.togglePublished = function() {
    if($scope.isPublished === "published"){
      $http.put('/look/'+$scope.lookId+'/published', JSON.stringify({'publish':'0'})).
        success(function(data){
          console.log(data);
          $scope.isPublished = "unpublished";
        });
      
    } else {
      $http.put('/look/'+$scope.lookId+'/published', JSON.stringify({'publish':'1'})).
        success(function(data){
          console.log(data);
          $scope.isPublished = "published";
        });
    }
  };

}