
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
                  },
                getHeight : function(id) {
                  return 200;
                },
                getWidth : function(id) {
                  return 200;
                }
               }
        });
  }));

  it('should make an HTTP callout to get its data', function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').
        respond({ tags : [{index : 1}], size : { height : 200, width: 200 } });

    scope.loadLook('1234');
    $httpBackend.flush();
    expect(scope.idsToLooks['1234'].tags.length).toBe(1);
    expect(scope.idsToLooks['1234'].tags[0].index).toBe(1);
  });

  it('should add tag successfully', function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').
        respond({ tags : [{index : 1}], size : { height : 200, width: 200 } });

    scope.loadLook('1234');
    $httpBackend.flush();

    scope.addTag('1234', 25, 15);
    expect(scope.idsToLooks['1234'].tags.length).toBe(2);
    expect(scope.idsToLooks['1234'].tags[1].index).toBe(2);
    expect(scope.idsToLooks['1234'].tags[1].position.x).toBe(15);
    expect(scope.idsToLooks['1234'].tags[1].position.y).toBe(10);
  });

  it('should delete tag successfully including updating indices', function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').
        respond({ tags : [], size : { height : 200, width: 200 }  });

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
  
  it('should handle stop/start editting tag', function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').
        respond({ tags : [], size : { height : 200, width: 200 }  });

    scope.loadLook('1234');
    $httpBackend.flush();
    
    var tag1 = scope.addTag('1234', 25, 15);
    var tag2 = scope.addTag('1234', 50, 25);
    scope.startEdittingTag('1234', tag1);
    expect(scope.idsToEditTag['1234']).toBe(tag1);
    expect(scope.isEdittingTag('1234')).toBe(true);
    
    scope.finishEdittingTag('1234');
    expect(scope.idsToEditTag['1234']).toBe(null);
    expect(scope.isEdittingTag('1234')).toBe(false);
  });
  
  it('should handle drag and drop correctly', function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').
        respond({ tags : [], size : { height : 200, width: 200 } });

    scope.loadLook('1234');
    $httpBackend.flush();
    var tag1 = scope.addTag('1234', 25, 15);
    scope.startDraggingTag('1234', tag1);
    scope.updateDraggingTagPosition('1234', 36, 21);
    scope.finishDraggingTag('1234', tag1);
    expect(tag1.position.x).toBe(26);
    expect(tag1.position.y).toBe(16);
  });
});
