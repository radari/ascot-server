
describe('TaggerViewController', function() {
  var scope, v, $httpBackend;

  beforeEach(inject(function($injector, $rootScope, $controller) {
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();

    v = $controller(TaggerViewController,
        { $scope : scope,
          ImageOffsetService :
              { getOffset :
                  function(id) {
                    return { x : 10, y : 5 };
                  }
               }
        });
  }));

  it('should make an HTTP callout to get its data', function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').
        respond({ tags : [{index : 1}] });

    scope.loadLook('1234');
    $httpBackend.flush();
    expect(scope.idsToLooks['1234'].tags.length).toBe(1);
    expect(scope.idsToLooks['1234'].tags[0].index).toBe(1);
  });

  it('should add tag successfully', function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').
        respond({ tags : [{index : 1}] });

    scope.loadLook('1234');
    $httpBackend.flush();

    scope.addTag('1234', 25, 15);
    expect(scope.idsToLooks['1234'].tags.length).toBe(2);
    expect(scope.idsToLooks['1234'].tags[1].index).toBe(2);
    expect(scope.idsToLooks['1234'].tags[1].position.x).toBe(15);
    expect(scope.idsToLooks['1234'].tags[1].position.y).toBe(10);
  });

  it('should save product index after done tagging', function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').
        respond({ tags : [] });

    scope.loadLook('1234');
    $httpBackend.flush();
    
    var tag1 = scope.addTag('1234', 25, 15);
    expect(scope.idsToEditTag['1234']).toBe(tag1);
    
    scope.setTaggedProduct('1234', { _id : '567' });
    expect(scope.idsToEditTag['1234']).toBe(null);
    expect(scope.idsToLooks['1234'].tags.length).toBe(1);
    expect(scope.idsToLooks['1234'].tags[0].product).toBe('567');
    expect(scope.idsToSearchQueries['1234']).toBe('');
    expect(scope.idsToSearchResults['1234'].length).toBe(0);
  });

  it('should delete tag successfully including updating indices', function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').
        respond({ tags : [] });

    scope.loadLook('1234');
    $httpBackend.flush();

    var tag1 = scope.addTag('1234', 25, 15);
    var tag2 = scope.addTag('1234', 50, 25);
    var tag3 = scope.addTag('1234', 75, 50);
    expect(scope.idsToLooks['1234'].tags.length).toBe(3);
    
    scope.deleteTag('1234', tag2);
    expect(scope.idsToLooks['1234'].tags.length).toBe(2);
    expect(tag1.index).toBe(1);
    expect(tag3.index).toBe(2);
  });
});
