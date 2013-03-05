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
  var scope, v, url, autocompleteUrl;
  
  beforeEach(inject(function($injector, $rootScope, $controller) {
    scope = $rootScope.$new();
    url = "";
    
    v = $controller(MainSearchBarController,
        { $scope : scope,
          $redirect : function(u) {
            url = u;
          },
          $autocomplete : {
            setUrl : function(tag, url) {
              autocompleteUrl = url;
            }
          }
        });
  }));
  
  it('should set autocomplete url properly', function() {
    expect(autocompleteUrl).toBe('/filters.json');
  });
  
  it('should display filters properly', function() {
    var filters =
        [
          { type : 'Brand', v : 'nike' },
          { type : 'Keyword', v : 'ni' }
        ];

    expect(scope.filterToString(filters[0])).toBe('nike (Brand)');
    expect(scope.filterToString(filters[1])).toBe('Search for ni');
  });
  
  it('should redirect properly', function() {
    scope.mainSearch = 'test1234';
    
    var filters =
        [
          { type : 'Brand', v : 'nike' },
          { type : 'Keyword', v : 'ni' }
        ];
    
    expect(url).toBe('');
    
    scope.onSelected(filters[0]);
    expect(url).toBe('/brand?v=nike');
    
    scope.onSelected(filters[1]);
    expect(url).toBe('/keywords?v=ni');
  });
});
