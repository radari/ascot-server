/**
 *  SettingsController.test.js
 *
 *  Created on: March 26, 2013
 *      Author: Valeri Karpov
 *
 *  Test for SettingsController
 *
 */

describe('SettingsController', function() {
  var scope, v, $httpBackend, msg;

  beforeEach(inject(function($injector, $rootScope, $controller) {
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();
    url = "";

    v = $controller(SettingsController,
        { $scope : scope,
          $window : { alert : function(m) { msg = m; } }
        });
  }));
  
  it('should set data field', function() {
    scope.init({ _id : '1234' });
    
    expect(scope.data._id).toBe('1234');
  });
  
  it('should do an HTTP put to save', function() {
    scope.init({ _id : '1234' });
    
    $httpBackend.expectPUT('/user/settings').respond({});
    scope.save(true);
    $httpBackend.flush();
    
    expect(msg).toBe('Successfully saved');
    
    scope.save(false);
    expect(msg).toBe('There were errors in your settings. Please correct them');
  });
});
