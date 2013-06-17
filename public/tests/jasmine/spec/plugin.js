describe('Ascot plugin', function() {
  describe('Ascot Plugin object', function() {
    var plugin;

    beforeEach(function() {
      plugin = new AscotPlugin('http://test');
    });

    it("should parse hash parameters properly", function() {
      expect(plugin.parseHashParams('http://www.google.com/#ascot=1234')).
          toEqual({ ascot : '1234' });
      expect(plugin.parseHashParams('http://www.google.com/abcd/#ascot')).
          toEqual({ });
      expect(plugin.parseHashParams('http://www.google.com/?abcd=12&ascot=1234')).
          toEqual({});
      expect(plugin.parseHashParams('http://www.google.com/?abcd=12#ascot=1234')).
          toEqual({ ascot : '1234' });
      expect(plugin.parseHashParams('http://www.google.com/?abcd=12#ascot=1234#test=abc')).
          toEqual({ ascot : '1234', test : 'abc' });
      expect(plugin.parseHashParams('http://www.google.com/?abcd=12#ascot=1234&test=12345')).
          toEqual({ ascot : '1234', test : '12345' });
      expect(plugin.parseHashParams('http://www.google.com/?abcd=12#/ascot=1234&test=abcdef')).
          toEqual({ ascot : '1234', test : 'abcdef' });
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
      expect(plugin.getFacebookUrl({ _id : '1234' })).
          toBe("http://test/fb/upload/1234");
    });

    it("should generate correct Pinterest share url", function() {
      expect(plugin.getPinterestUrl(
          { _id : '1234',
            taggedUrl : 'myTaggedImage',
            title : 'Title',
            tags : [
              { product : { brand : 'Nike', name : 'AirZoom3', buyLinkMinified : 'minified' }}
            ]
          })).
          toBe( '//pinterest.com/pin/create/button/?url=' + encodeURIComponent('http://test/look/1234') +
                '&media=myTaggedImage' +
                '&description=' + encodeURIComponent('Title / 1. Nike AirZoom3 minified'));
    });

    it("should generate HTML version properly", function() {
      var mockLook = { 
          _id : '1234',
          taggedUrl : 'http://test',
          tags : [
              { position : { x : 100, y : 100 },
                product : { buyLink : 'http://buy', brand : 'Nike', name : 'Air Zoom 3' }
              }]
      };

      expect(plugin.getImageMap(mockLook)).
          toBe( "<img src='http://test' usemap='#ascot1234'>" +
                "<map name='ascot1234'>" +
                "<area shape='circle' coords='100,100,15' href='http://buy' title='Nike Air Zoom 3' alt='Nike Air Zoom 3' target='_blank'>" +
                "</map>" +
                "<br>" +
                "1. <a href='http://buy' target='_blank'><b>Nike</b> Air Zoom 3</a>" +
                "<br>");
    });
  });

  describe("Ascot Plugin UI", function() {
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
        this.parent = function() {
          return {
            get : function(i) {
              return null;
            }
          };
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
      expect(tagDescription.props['left']).toBe('8px');
      expect(tagDescription.props['top']).toBe('8px');
      expect(tagDescription.container).toBe(tagContainer);
      expect(tagDescription.myHtml).toContain("Bonobos");
      expect(tagDescription.myHtml).toContain("Test");
      expect(tagDescription.myHtml).toContain("http://mywebsite.com");

      tagDescription = new MockTagDescription();
      UI.constructTagDescription(100, 100, tagContainer, tagDescription, tag, { x : 75, y : 25 });
      expect(tagDescription.props['right']).toBe('8px');
      expect(tagDescription.props['top']).toBe('8px');

      tagDescription = new MockTagDescription();
      UI.constructTagDescription(100, 100, tagContainer, tagDescription, tag, { x : 75, y : 75 });
      expect(tagDescription.props['right']).toBe('8px');
      expect(tagDescription.props['bottom']).toBe('8px');

      tagDescription = new MockTagDescription();
      UI.constructTagDescription(100, 100, tagContainer, tagDescription, tag, { x : 25, y : 75 });
      expect(tagDescription.props['left']).toBe('8px');
      expect(tagDescription.props['bottom']).toBe('8px');
    });
    
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

    it('should be able to create iframe display', function() {
      var mockLook = { _id : 'ABCD' };
      var UI = new AscotPluginUI('http://test', 'http://mywebsite.com', mockLook);

      var els = [];
      var mockReturnValue = { _id : '1234' };
      var mockMenuWrapper = {
        append : function(html) {
          els.push(html);
        },
        children : function() {
          return { last : function() { return mockReturnValue; } };
        }
      };

      var r = UI.createIframeDisplay(mockMenuWrapper, 'MYTESTCODE');
      expect(r).toBe(mockReturnValue);
      expect(els.length).toBe(1);
      expect(els[0]).toContain('MYTESTCODE');
    });

    it('should be able to create email display', function() {
      var mockLook = { _id : 'ABCD' };
      var UI = new AscotPluginUI('http://test', 'http://mywebsite.com', mockLook);

      var els = [];
      var mockReturnValue = { _id : '1234' };
      var mockMenuWrapper = {
        append : function(html) {
          els.push(html);
        },
        children : function() {
          return { last : function() { return mockReturnValue; } };
        }
      };

      var r = UI.createEmailDisplay(mockMenuWrapper, 'MYTESTCODE');
      expect(r).toBe(mockReturnValue);
      expect(els.length).toBe(1);
      expect(els[0]).toContain('MYTESTCODE');
    });

    it('should be able to create a social tool display properly', function() {
      var mockLook = { _id : 'ABCD' };
      var UI = new AscotPluginUI('http://test', 'http://mywebsite.com', mockLook);

      expect(UI.appendSocialTool('Twitter', 'http://www.google.com/test.png', 'http://www.twitter.com')).
          toContain("_gaq.push([\'ascot._trackEvent\', 'twitter', 'ABCD', 'http://mywebsite.com'])");
      expect(UI.appendSocialTool('Twitter', 'http://www.google.com/test.png', 'http://www.twitter.com')).
          toContain('<img id="ascot_overlay_social" src="http://www.google.com/test.png">');
      expect(UI.appendSocialTool('Twitter', 'http://www.google.com/test.png', 'http://www.twitter.com')).
          toContain('<div class="ascot_overlay_social_name">Twitter</div>');
    });

    it('should be able to properly format Google analytics command', function() {
      var mockLook = { _id : 'ABCD' };
      var UI = new AscotPluginUI('http://test', 'http://mywebsite.com', mockLook);

      expect(UI.createShareMenuGACommand('mylabel')).
          toBe("_gaq.push([\'ascot._trackEvent\', 'mylabel', 'ABCD', 'http://mywebsite.com'])");
    });

    it('should be able to create image menu', function() {
      var mockLook = { _id : 'ABCD' };
      var UI = new AscotPluginUI('http://test', 'http://mywebsite.com', mockLook);

      var els = [];
      var mockReturnValue = { _id : '1234' };
      var mockMenuWrapper = {
        append : function(html) {
          els.push(html);
        },
        children : function() {
          return { last : function() { return mockReturnValue; } };
        }
      };

      var r = UI.createImageMenu(mockMenuWrapper, 'MYTESTCODE');
      expect(r).toBe(mockReturnValue);
      expect(els.length).toBe(1);
      expect(els[0]).toBe(
          '<div class="ascot_overlay_image_menu">' +
          '<div><img style="cursor: pointer; height: 28px; width: 24px;" id="ascot_overlay_menu_item" src="' +
          'http://test/images/overlayOptions_share.png"></a></div>' +
          '<div><img id="ascot_overlay_menu_item" style="cursor: pointer; height: 24px; width: 24px;" src="' +
          'http://test/images/overlayOptions_heart_small.png"></a></div>' +
          '</div>');
    });

    it('should add source tag properly when source is a link', function() {
      var mockLook = { _id : 'ABCD', source : 'http://mytest' };
      var UI = new AscotPluginUI('http://test', 'http://mywebsite.com', mockLook);

      var els = [];
      var mockReturnValue = { _id : '1234' };
      var mockMenuWrapper = {
        append : function(html) {
          els.push(html);
        },
        children : function() {
          return { last : function() { return mockReturnValue; } };
        }
      };

      var r = UI.createSourceTag(mockMenuWrapper);
      expect(r).toBe(mockReturnValue);
      expect(els.length).toBe(1);
      expect(els[0]).toBe(
          '<div class="ascot_overlay_source_tag">i<div class="ascot_overlay_source_url">' +
          '<a href="' +
          'http://mytest\">' +
          'http://mytest' +
          '</a>' +
          '</div>');
    });

    it('should add source tag properly when source is not a link', function() {
      var mockLook = { _id : 'ABCD', source : 'mytest' };
      var UI = new AscotPluginUI('http://test', 'http://mywebsite.com', mockLook);

      var els = [];
      var mockReturnValue = { _id : '1234' };
      var mockMenuWrapper = {
        append : function(html) {
          els.push(html);
        },
        children : function() {
          return { last : function() { return mockReturnValue; } };
        }
      };

      var r = UI.createSourceTag(mockMenuWrapper);
      expect(r).toBe(mockReturnValue);
      expect(els.length).toBe(1);
      expect(els[0]).toBe(
          '<div class="ascot_overlay_source_tag">i<div class="ascot_overlay_source_url">' +
          'mytest' +
          '</div>');
    });
  });
});
