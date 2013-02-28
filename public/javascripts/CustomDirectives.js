angular.module('CustomDirectives', []).directive('ngDirectional', function() {
  return function(scope, elm, attrs) {
    var keyUp = attrs.ngKeyUp;
    var keyDown = attrs.ngKeyDown;
    var enter = attrs.ngKeyReturn;
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
}).directive('ngWhenScrolled', function($timeout) {
  return function(scope, elm, attr) {
    var fn = function(callback) {
      if ($(document).scrollTop() + $(window).height() >= elm.offset().top + elm.height()) {
        scope.$apply(attr.ngWhenScrolled);
      }
    };

    var interval = setInterval(fn, 250);

    $(window).bind('scroll', function() {
      fn();
    });
  };
}).directive('ngImagesLoaded', function() {
  return function(scope, elm, attr) {
    elm.imagesLoaded(function() {
      scope.$apply(attr.ngImagesLoaded);
    });
  };
});
