describe('Ascot plugin', function() {
  describe('Ascot Plugin object', function() {
    var plugin;

    beforeEach(function() {
      plugin = new AscotPlugin('http://test');
    });

    it("should get URL hash param properly", function() {
      expect(plugin.getAscotHashParam('http://www.google.com/#ascot=1234')).
          toEqual('1234');
      expect(plugin.getAscotHashParam('http://www.google.com/?abcd=12&ascot=1234')).
          toEqual(null);
      expect(plugin.getAscotHashParam('http://www.google.com/?abcd=12#ascot=1234')).
          toEqual('1234');
    });

    it("should htmlify a look properly", function() {
      var look = {
        title : "My title",
        source : "My Source",
        tags : [
          { product : { brand : "Bonobos", name : "Tiny Prancers", buyLink : "www.google.com" } }
        ]
      };

      expect(plugin.htmlifyTags(look)).
          toBe("My title<br>Source: My Source<br><br>1. <a href='www.google.com'><b>Bonobos</b> Tiny Prancers</a>");
    });

    it("should generate correct Tumblr share URL", function() {
      var testLook = { _id : '1234', url : 'myurl' };
      var fn = plugin.tumblrUrlGenerator(
        function(look) {
          expect(look._id).toBe('1234');
          return look._id;
        }, function(str) {
          return "$" + str;
        });

      var ret = fn(testLook);
      expect(ret).
          toBe("http://www.tumblr.com/share/photo?source=$myurl&clickthru=$http://www.ascotproject.com/look/1234&caption=$1234&tags=ascot");
    });

    it("should generate correct Twitter share url", function() {
      expect(plugin.getTwitterUrl('test')).
          toBe("https://twitter.com/share?url=test&via=AscotProject");
    });

    it("should generate correct iframe code", function() {
      expect(plugin.getIframeCode({ _id : '1234', size : { height : 25, width : 30 } })).
          toBe('<iframe src="http://www.ascotproject.com/look/1234/iframe" width="30" height="25" frameborder="0" scrolling="no"></iframe>');
    });

    it("should generate correct Facebook share url", function() {
      expect(plugin.getFacebookUrl('test')).
          toBe("https://www.facebook.com/dialog/send?app_id=169111373238111&link=test&redirect_uri=test");
    });

    it("should generate correct Pinterest share url", function() {
      expect(plugin.getPinterestUrl('image', 'test')).
          toBe('//pinterest.com/pin/create/button/?url=test&media=image&description=From%3A%20test');
    });

    it("should generate HTML version properly", function() {
      var mockLook = { 
          _id : '1234',
          taggedUrl : 'http://test',
          tags : [
              { position : { x : 100, y : 100 },
                product : { buyLink : 'http://buy' }
              }]
      };

      expect(plugin.getImageMap(mockLook)).
          toBe( "<img src='http://test' usemap='#ascot1234'>" +
                "<map name='ascot1234'>" +
                "<area shape='circle' coords='100,100,12' href='http://buy' target='_blank'>" +
                "</map>");
    });
  });

  describe("Ascot Plugin UI", function() {
    it('should handle upvote look properly', function() {
      var UI = new AscotPluginUI('http://test', 'http://mywebsite.com');

      var ascotId = '1234';
      var mockJsonp = function(url, callback) {
        expect(url).toBe('http://test/upvote/1234.jsonp');
        callback({ add : true });
      };

      var props = {};
      var mockUpvoteButton = {
        attr : function(attr, value) {
          props[attr] = value;
        },
        css : function(attr, value) {
          props[attr] = value;
        }
      };

      UI.handleUpvoteLook(mockJsonp, mockUpvoteButton, ascotId);
      expect(props['cursor']).toBe('pointer');
      expect(props['src']).toBe('http://test/images/overlayOptions_heart_small_opaque.png');
      expect(props['opacity']).toBe('1');

      UI.handleUpvoteLook(function(url, callback) {
            callback({ remove : true });
          },
          mockUpvoteButton,
          ascotId);
      expect(props['cursor']).toBe('pointer');
      expect(props['src']).toBe('http://test/images/overlayOptions_heart_small.png');
      expect(props['opacity']).toBe('0.6');
    });

    it("should set up tag container properly", function() {
      var mockOverlay = { me : true };
      var mockTagContainer = new function() {
        this.props = {};
        this.css = function(key, val) {
          this.props[key] = val;
        },
        this.appendTo = function(el) {
          this.container = el;
        };
      }();

      var defaultSize = { height : 100, width : 100 };
      var actualSize = { height : 100, width : 100 };
      var tag = { position : { x : 25, y : 25 } };

      var UI = new AscotPluginUI('http://test', 'http://mywebsite.com');
      var ret = UI.constructTagContainer(mockOverlay, mockTagContainer, defaultSize, actualSize, tag);
      expect(ret.x).toBe(25);
      expect(ret.y).toBe(25);
      expect(mockTagContainer.container).toBe(mockOverlay);
    });

    it("should add tag description properly", function() {
      var UI = new AscotPluginUI('http://test', 'http://mywebsite.com');

      var MockTagDescription = function() {
        this.props = {};
        this.css = function(key, val) {
          this.props[key] = val;
        };
        this.hide = function() {
          this.props['display'] = 'none';
        };
        this.appendTo = function(container) {
          this.container = container;
        };
        this.html = function(html) {
          this.myHtml = html;
        };
      };
      var tagDescription = new MockTagDescription();
      var tagContainer = { me : true };
      var tag = {
        product : { brand : 'Bonobos', name : 'Test', buyLink : 'google' }
      }

      UI.constructTagDescription(100, 100, tagContainer, tagDescription, tag, { x : 25, y : 25 });
      expect(tagDescription.props['left']).toBe('5px');
      expect(tagDescription.props['top']).toBe('5px');
      expect(tagDescription.container).toBe(tagContainer);
      expect(tagDescription.myHtml).toContain("Bonobos");
      expect(tagDescription.myHtml).toContain("Test");
      expect(tagDescription.myHtml).toContain("http://mywebsite.com");

      tagDescription = new MockTagDescription();
      UI.constructTagDescription(100, 100, tagContainer, tagDescription, tag, { x : 75, y : 25 });
      expect(tagDescription.props['right']).toBe('5px');
      expect(tagDescription.props['top']).toBe('5px');

      tagDescription = new MockTagDescription();
      UI.constructTagDescription(100, 100, tagContainer, tagDescription, tag, { x : 75, y : 75 });
      expect(tagDescription.props['right']).toBe('5px');
      expect(tagDescription.props['bottom']).toBe('5px');

      tagDescription = new MockTagDescription();
      UI.constructTagDescription(100, 100, tagContainer, tagDescription, tag, { x : 25, y : 75 });
      expect(tagDescription.props['left']).toBe('5px');
      expect(tagDescription.props['bottom']).toBe('5px');
    });
    
  });
});