/**
 *  SettingsController.js
 *
 *  Created on: March 21, 2013
 *      Author: Valeri Karpov
 *
 *  Controller for /settings route
 *
 */

function SettingsController($scope, $http, $window) {
  $scope.init = function(data) {
    if ($scope.data) {
      return;
    }
    $scope.data = data;
  };

  $scope.save = function(valid) {
    if (valid) {
      $http.put('/user/settings', $scope.data).
        success(function(data) {
          if (data.error) {
            $window.alert('Error occurred - ' + data.error.error);
          } else {
            $window.alert('Successfully saved');
          }
        });
    } else {
      $window.alert('There were errors in your settings. Please correct them');
    }
  };
}
