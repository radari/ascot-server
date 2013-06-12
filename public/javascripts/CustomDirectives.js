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
      if ($(document).scrollTop() + $(window).height() >= elm.offset().top + elm.height() - 250) {
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
}).directive('ngFocus', function() {
  return function(scope, elm, attrs) {
    elm.bind('focus', function() {
      scope.$eval(attrs.ngFocus);
      scope.$apply();
    });
  };
}).directive('ngBlur', function($timeout) {
  return function(scope, elm, attrs) {
    elm.bind('blur', function() {
      $timeout(function() {
        scope.$eval(attrs.ngBlur);
        scope.$apply();
      }, 200);
    });
  };
}).directive('ngAutofocus', function() {
  return function(scope, elm, attrs) {
    if(scope.$eval(attrs.ngAutofocus)) {
      elm.focus();
    }
  };
}).directive('ngFade', function() {
  return function(scope, elm, attrs) {
    elm.css('display', 'none');
    scope.$watch(attrs.ngFade, function(value) {
      if (value) {
        elm.fadeIn(200);
      } else {
        elm.fadeOut(100);
      }
    });
  };
}).directive('ngSwipeLeft', function() {
  return function(scope, elm, attrs) {
    Hammer(elm).on('swipeleft', function() {
      scope.$eval(attrs.ngSwipeLeft);
      scope.$apply();
    });
  }
}).directive('ngSwipeRight', function() {
  return function(scope, elm, attrs) {
    Hammer(elm).on('swiperight', function() {
      scope.$eval(attrs.ngSwipeRight);
      scope.$apply();
    });
  }
}).directive('jqMinicolors', function($timeout) {
  return {
    restrict : 'A',
    scope : { rgb : '=ngColor' },
    link : function(scope, elm, attrs) {
      // $timeout hack because 'link' happens before
      // DOM is fully rendered, see
      // https://github.com/angular-ui/ui-utils/tree/master/modules/jq
      $timeout(function() {
        var e = $(elm).minicolors({
          opacity : false,
          defaultValue : scope.rgb,
          change : function(hex) {
            scope.rgb = hex;
            scope.$apply();
            scope.$parent.$eval(attrs.ngChange);
          }
        });
      }, 0);
    }
  };
});
