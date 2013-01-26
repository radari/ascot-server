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
  
  it('should redirect properly', function() {
    scope.mainSearch = 'test1234';
    
    var filters =
        [
          { type : 'Brand', v : 'nike' },
          { type : 'Keyword', v : 'ni' }
        ];
    
    $httpBackend.expectGET('/filters.json?query=test1234').
        respond(
        { data : filters,
          suggestions : ['def', 'abc']
        });
    scope.updateResults();
    $httpBackend.flush();
    
    expect(url).toBe('');
    
    scope.onSelected(filters[0]);
    expect(url).toBe('/brand?v=nike');
    
    scope.onSelected(filters[1]);
    expect(url).toBe('/keywords?v=ni');
  });
});
