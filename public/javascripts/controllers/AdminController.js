/*
 *  MainSearchBarController.js
 *
 *  Created on: February 20, 2013
 *      Author: Matt Green
 *
 *  Controller for admin panel
 *
 */

function AdminController($scope, $http, $window) {
  
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

  $scope.delete = function(look) {
    alert(JSON.stringify(look));
    if ($window.confirm("Are you sure you want to delete this look '" + (look.title || 'Untitled') + "'?")) {
      $http.delete('/admin/look/' + look._id).success(function(data) {
        alert(JSON.stringify(data));
        $window.location.href = '/admin/index';
      }).error(function(d) {
        alert('error');
      });
    }
  }
}