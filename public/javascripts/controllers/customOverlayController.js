function CustomOverlayController($scope, $http, $window) {
  $scope.look = {};

  $scope.init = function(look) {
    $scope.look = look;
  };

  $scope.updatePlugin = function() {
    $window.ascotPluginKillOverlay($('#customizeSample'));
    $window.ascotPluginMakeOverlay($('#customizeSample'), $scope.look._id, $scope.look.url, { hasUpvotedCookie : false, look : $scope.look });
  };
}