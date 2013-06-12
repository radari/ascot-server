function CustomOverlayController($scope, $http, $window) {
  $scope.look = {};
  //$scope.testColor = '#FFD700';

  $scope.init = function(look) {
    $scope.look = look;

    //$('input.minicolors').minicolors({ opacity : false, defaultValue : $scope.look.viewConfig[0].display.backgroundColor });
  };

  $scope.updatePlugin = function() {
    $window.ascotPlugin.killOverlay($('#customizeSample'));
    $window.ascotPlugin.makeOverlay($('#customizeSample'), $scope.look._id, $scope.look.url, { hasUpvotedCookie : false, look : $scope.look });
  };

  $scope.updateColor = function() {
    $scope.updatePlugin();
  };

  $scope.save = function() {
    $http.put('/customize/' + $scope.look._id, $scope.look.viewConfig[0]).success(function(result) {
      if (result.error) {
        alert('Failed to save config - ' + JSON.stringify(result.error));
      } else {
        alert('Successfully saved');
      }
    });
  };
}
