angular.module('DirectivesModule', []).directive('ngDirectional', function() {
  return function(scope, elm, attrs) {
    var keyUp = attrs.keyUp;
    var keyDown = attrs.keyDown;
    var enter = attrs.keyReturn;
    elm.bind('keyup', function(evt) {
      //$apply makes sure that angular knows 
      //we're changing something
      if (evt.which == 38 && keyUp) {
        scope.$eval(keyUp);
        scope.$apply();
      } else if (evt.which == 40 && keyDown) {
        scope.$eval(keyDown);
        scope.$apply();
      } else if (evt.which == 13 && enter) {
        scope.$eval(enter);
        scope.$apply();
      }
    });
  };
});
