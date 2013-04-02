
describe('TaggerViewController', function() {
  var scope, v, $httpBackend, url, confirm;

  beforeEach(inject(function($injector, $rootScope, $controller) {
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();
    url = "";

    v = $controller(TaggerViewController,
        { $scope : scope,
          $imagePosition :
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
               },
          $redirect : function(u) {
            url = u;
          },
          $autocomplete : {
            // Currently no-op just to make tests pass
            setUrl : function(tag, url) {}
          },
          $window : {
            confirm : function(msg) {
              confirm = msg;
            }
          }
        });
  }));

  it('should make an HTTP callout to get its data', function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').
        respond({ look : { tags : [{index : 1}], size : { height : 200, width: 200 } } });

    scope.loadLook('1234');
    $httpBackend.flush();
    expect(scope.idsToLooks['1234'].tags.length).toBe(1);
    expect(scope.idsToLooks['1234'].tags[0].index).toBe(1);
  });

  it('should add tag successfully', function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').
        respond({ look : { tags : [{index : 1}], size : { height : 200, width: 200 } } });

    scope.loadLook('1234');
    $httpBackend.flush();

    scope.addTag('1234', 25, 15);
    expect(scope.idsToLooks['1234'].tags.length).toBe(2);
    expect(scope.idsToLooks['1234'].tags[1].index).toBe(2);
    // mouse click at 25, x offset 10
    expect(scope.idsToLooks['1234'].tags[1].position.x).toBe(15);
    expect(scope.idsToLooks['1234'].tags[1].position.y).toBe(10);
  });

  it('should display edit tag overlay in the right place', function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').
        respond({ look : { tags : [{index : 1}], size : { height : 200, width: 200 } } });

    scope.loadLook('1234');
    $httpBackend.flush();

    scope.addTag('1234', 25, 15);
    // mouse click at 25, subtract x offset 10, add 25
    expect(scope.computeEditTagOverlayDisplayPosition('1234').left).toBe('40px');
    expect(scope.computeEditTagOverlayDisplayPosition('1234').top).toBe('35px');
    scope.finishEdittingTag('1234');

    scope.addTag('1234', 120, 15);
    // add tag at absolute position 120, subtract 10 for offset
    expect(scope.computeEditTagOverlayDisplayPosition('1234').right).toBe('90px');
    expect(scope.computeEditTagOverlayDisplayPosition('1234').top).toBe('35px');
    scope.finishEdittingTag('1234');

    scope.addTag('1234', 25, 120);
    expect(scope.computeEditTagOverlayDisplayPosition('1234').left).toBe('40px');
    expect(scope.computeEditTagOverlayDisplayPosition('1234').bottom).toBe('85px');
    scope.finishEdittingTag('1234');

    scope.addTag('1234', 120, 120);
    expect(scope.computeEditTagOverlayDisplayPosition('1234').right).toBe('90px');
    expect(scope.computeEditTagOverlayDisplayPosition('1234').bottom).toBe('85px');
    scope.finishEdittingTag('1234');
  });

  it('should delete tag successfully including updating indices', function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').
        respond({ look : { tags : [], size : { height : 200, width: 200 } } });

    scope.loadLook('1234');
    $httpBackend.flush();

    var tag1 = scope.addTag('1234', 25, 15);
    scope.finishEdittingTag('1234');
    var tag2 = scope.addTag('1234', 50, 25);
    scope.finishEdittingTag('1234');
    var tag3 = scope.addTag('1234', 75, 50);
    scope.finishEdittingTag('1234');
    expect(scope.idsToLooks['1234'].tags.length).toBe(3);
    
    scope.deleteTag('1234', tag2);
    expect(scope.idsToLooks['1234'].tags.length).toBe(2);
    expect(tag1.index).toBe(1);
    expect(tag3.index).toBe(2);
  });
  
  it('should handle stop/start editting tag', function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').
        respond({ look : { tags : [], size : { height : 200, width: 200 } } });

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
        respond({ look : { tags : [], size : { height : 200, width: 200 } } });

    scope.loadLook('1234');
    $httpBackend.flush();
    var tag1 = scope.addTag('1234', 25, 15);
    scope.startDraggingTag('1234', tag1);
    scope.updateDraggingTagPosition('1234', 36, 21);
    scope.finishDraggingTag('1234', tag1);
    expect(tag1.position.x).toBe(26);
    expect(tag1.position.y).toBe(16);
  });

  it('should compute positions properly for resized images', function() {
    // Image is 2x size of test $imagePosition
    $httpBackend.expectGET('/tags.jsonp?id=1234').
        respond({ look : { tags : [], size : { height : 400, width: 400 } } });

    scope.loadLook('1234');
    $httpBackend.flush();
    var tag1 = scope.addTag('1234', 40, 15);

    expect(tag1.position.x).toBe(60);
    expect(tag1.position.y).toBe(20);
  });

  it('should do a put and redirect after clicking save', function () {
    $httpBackend.expectGET('/tags.jsonp?id=1234').
        respond({ look : { tags : [], size : { height : 200, width: 200 } } });

    scope.loadLook('1234');
    $httpBackend.flush();
    var tag1 = scope.addTag('1234', 25, 15);

    $httpBackend.expectPUT('/tagger/1234').respond({});
    scope.finalize('1234');
    $httpBackend.flush();
    expect(url).toBe('/look/1234?showProgress=1');
  });
  
  it('should pop up a confirm message if there are no tags', function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').
        respond({ look : { tags : [], size : { height : 200, width: 200 } } });

    scope.loadLook('1234');
    $httpBackend.flush();
    scope.finalize('1234', '5678');
    expect(confirm).toBe("You haven't added any tags. Are you sure you want to submit?");
  });

  it('should add http:// before buy link if it isn\'t already there', function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').
        respond({ look : { tags : [], size : { height : 200, width: 200 } } });

    scope.loadLook('1234');
    $httpBackend.flush();

    var tag1 = scope.addTag('1234', 40, 15);
    tag1.product.buyLink = 'www.test.tk';

    scope.finishEdittingTag('1234');
    expect(tag1.product.buyLink).toBe('http://www.test.tk');

    scope.startEdittingTag('1234', tag1);
    tag1.product.buyLink = 'http://www.google.com';
    scope.finishEdittingTag('1234');
    expect(tag1.product.buyLink).toBe('http://www.google.com');
  });

  it("should autosave on add, delete, and drag if enabled", function() {
    $httpBackend.expectGET('/tags.jsonp?id=1234').
        respond({ look : { tags : [], size : { height : 200, width: 200 } } });

    scope.loadLook('1234');
    $httpBackend.flush();

    scope.enableAutosave('1234', true);

    var tag1 = scope.addTag('1234', 25, 15);

    $httpBackend.expectPUT('/tagger/1234').
        respond({});

    scope.finishEdittingTag('1234');
    $httpBackend.flush();

    scope.startDraggingTag('1234', tag1);
    scope.updateDraggingTagPosition('1234', 36, 21);

    $httpBackend.expectPUT('/tagger/1234').
        respond({});
    scope.finishDraggingTag('1234', tag1);
    $httpBackend.flush();

    $httpBackend.expectPUT('/tagger/1234').
        respond({});
    scope.deleteTag('1234', tag1);
    $httpBackend.flush();
  });
});
