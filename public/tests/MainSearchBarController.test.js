/*
 *  MainSearchBarController.test.js
 *
 *  Created on: January 26, 2012
 *      Author: Valeri Karpov
 *
 *  Testacular test cases for MainSearchBarController
 *
 */

describe('MainSearchBarController', function() {
  var scope, v, $httpBackend, url;
  
  beforeEach(inject(function($injector, $rootScope, $controller) {
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();
    url = "";
    
    v = $controller(MainSearchBarController,
        { $scope : scope,
          $redirect : function(u) {
            url = u;
          }
        });
  }));
  
  it('should make HTTP callout when updating results', function() {
    scope.mainSearch = 'test1234';
    
    $httpBackend.expectGET('/filters.json?query=test1234').
        respond({ data : ['abc'], suggestions : ['def'] });
    scope.updateResults();
    $httpBackend.flush();
    
    expect(scope.results.length).toBe(1);
    expect(scope.results[0]).toBe('abc');
    expect(scope.suggestions.length).toBe(1);
    expect(scope.suggestions[0]).toBe('def');
  });
});
