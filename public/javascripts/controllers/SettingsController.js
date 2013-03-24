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
    alert('t');
    if (valid) {
      alert('x');
      $http.put('/user/settings', $scope.data).
        success(function(data) {
          if (data.error) {
            alert('Error occurred - ' + data.error.error);
          } else {
            alert('Successfully saved');
          }
        });
    } else {
      alert('There were errors in your settings. Please correct them');
    }
  };
}
