
describe('TaggerViewController', function() {
  var scope, v, $httpBackend;

  beforeEach(inject(function($injector, $rootScope, $controller) {
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();

    v = $controller(TaggerViewController, {$scope : scope, ImageOffsetService : { getOffset : function(id) { return { x : 10, y : 5 }; } } });
  }));

  it('should make an HTTP callout to get its data', function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').respond({ tags : [{index : 1}] });

    scope.loadLook('1234');
    $httpBackend.flush();
    expect(scope.idsToLooks['1234'].tags.length).toBe(1);
    expect(scope.idsToLooks['1234'].tags[0].index).toBe(1);
  });

  it('should add tag successfully', function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').respond({ tags : [{index : 1}] });

    scope.loadLook('1234');
    $httpBackend.flush();

    scope.addTag('1234', 25, 15);
    expect(scope.idsToLooks['1234'].tags.length).toBe(2);
    expect(scope.idsToLooks['1234'].tags[1].index).toBe(2);
    expect(scope.idsToLooks['1234'].tags[1].position.x).toBe(15);
    expect(scope.idsToLooks['1234'].tags[1].position.y).toBe(10);
  });
});
