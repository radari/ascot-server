/**
 *  CollectionController.test.js
 *
 *  Created on: June 6, 2013
 *      Author: Valeri Karpov
 *
 *  Test for CollectionController
 *
 */

describe('CollectionController', function() {
  var scope, v, $httpBackend, resizeCount, $timeout, $windowSize;
  var h = 200, w = 200;

  beforeEach(inject(function($injector, $rootScope, $controller) {
    $httpBackend = $injector.get('$httpBackend');
    $window = $injector.get('$window');
    $timeout = $injector.get('$timeout');
    scope = $rootScope.$new();
    resizeCount = 0;
    
    $window.ascotPlugin = {
      resizeAll : function() {
        ++resizeCount;
      }
    };
    
    $windowSize = {
      getWindowSize : function() {
        return { height : h, width : w };
      },
      resize : function(callback) {
        // Do nothing
      }
    };

    v = $controller(CollectionController,
        { $scope : scope, $window : $window, $windowSize : $windowSize });
  }));
  
  it('should be able to get style', function() {
    var ret = scope.getImageStyle({ size : { height : 100, width : 100 } });
    expect(ret.height).toBe('200px');
    expect(ret['margin-top']).toBe('0px');
    expect(ret.width).toBe('200px');
  });
  
  it('should tell plugin to resize all on new height and width', function() {
    var ret = scope.getImageStyle({ size : { height : 100, width : 100 } });
    $timeout.flush();
    expect(resizeCount).toBe(1);
    
    h = 300;
    w = 400;
    var ret = scope.getImageStyle({ size : { height : 100, width : 100 } });
    expect(ret.height).toBe('300px');
    expect(ret['margin-top']).toBe('0px');
    expect(ret.width).toBe('300px');
    $timeout.flush();
    expect(resizeCount).toBe(2);
  });
  
  it('should not be entire screen height when screen is too narrow', function() {
    h = 300;
    w = 200;
    
    var ret = scope.getImageStyle({ size : { height : 100, width : 100 } });
    expect(ret.height).toBe('200px');
    expect(ret['margin-top']).toBe('0px');
    expect(ret.width).toBe('200px');
  });
});
