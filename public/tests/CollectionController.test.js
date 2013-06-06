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
  var scope, v, $httpBackend, resizeCount;

  beforeEach(inject(function($injector, $rootScope, $controller) {
    $httpBackend = $injector.get('$httpBackend');
    $window = $injector.get('$window');
    scope = $rootScope.$new();
    resizeCount = 0;
    
    $window.ascotPlugin = {
      resizeAll : function() {
        ++resizeCount;
      }
    };

    v = $controller(CollectionController,
        { $scope : scope, $window : $window });
  }));
  
  it('should get style properly', function() {
    
  });
});
