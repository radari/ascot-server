
describe('TaggerViewController', function() {
  var scope, v, $httpBackend;

  beforeEach(inject(function($injector, $rootScope, $controller) {
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();

    v = $controller(TaggerViewController, {$scope : scope});
  }));

  it('Should make an HTTP callout to get its data', function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').respond({ tags : [{index : 1}] });

    scope.loadLook('1234');
    $httpBackend.flush();
    expect(scope.idsToLooks['1234'].tags.length).toBe(1);
    expect(scope.idsToLooks['1234'].tags[0].index).toBe(1);
  });
});
