function CustomOverlayController($scope, $http, $window) {
  $scope.look = {};

  $scope.init = function(look) {
    $scope.look = look;

    $('input.minicolors').minicolors({ opacity : false, defaultValue : $scope.look.viewConfig[0].display.backgroundColor });
  };

  $scope.updatePlugin = function() {
    $window.ascotPluginKillOverlay($('#customizeSample'));
    $window.ascotPluginMakeOverlay($('#customizeSample'), $scope.look._id, $scope.look.url, { hasUpvotedCookie : false, look : $scope.look });
  };

  $scope.updateColor = function() {
    $scope.look.viewConfig[0].display.backgroundColor = $('input.minicolors').val();
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