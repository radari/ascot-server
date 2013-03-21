/**
 *  SettingsController.js
 *
 *  Created on: March 21, 2013
 *      Author: Valeri Karpov
 *
 *  Controller for /settings route
 *
 */

function SettingsController($scope, $http) {
  $scope.init = function(data) {
    if ($scope.data) {
      return;
    }
    $scope.data = data;
  };

  $scope.save = function(valid) {
  };
}