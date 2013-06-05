/**
 *  EditCollectionController.js
 *
 *  Created on: May 28, 2013
 *      Author: Valeri Karpov
 *
 *  Controller for adding and removing items from a collection
 *
 */

function EditCollectionController($scope, $http) {
  $scope.collection = {};

  $scope.initCollection = function(collection) {
    $scope.collection = collection;
  };

  $scope.lookInCollection = function(look) {
    for (var i = 0; i < $scope.collection.looks.length; ++i) {
      if ($scope.collection.looks[i]._id.toString() == look._id.toString()) {
        return true;
      }
    }
    return false;
  };

  $scope.color = function(look) {
    if ($scope.lookInCollection(look)) {
      return '#FF0000';
    } else {
      return '';
    }
  }

  $scope.addToCollection = function(look) {
    $scope.collection.looks.push(look);
  };

  $scope.removeFromCollection = function(look) {
    var ret = [];
    for (var i = 0; i < $scope.collection.looks.length; ++i) {
      if ($scope.collection.looks[i]._id.toString() != look._id.toString()) {
        ret.push($scope.collection.looks[i]);
      }
    }
    $scope.collection.looks = ret;
  };

  $scope.save = function() {
    $http.put('/admin/collection/' + $scope.collection._id, $scope.collection).success(function(data) {
      if (data.error) {
        alert("Error - " + JSON.stringify(data.error));
      } else {
        alert("Success");
      }
    });
  };
}
