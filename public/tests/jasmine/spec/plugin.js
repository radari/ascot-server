describe('Ascot plugin', function() {
  var plugin;

  beforeEach(function() {
    plugin = new AscotPlugin();
  });

  it("should get URL hash param properly", function() {
    expect(plugin.getAscotHashParam('http://www.google.com/#ascot=1234')).toEqual('1234');
    expect(plugin.getAscotHashParam('http://www.google.com/?abcd=12&ascot=1234')).toEqual(null);
    expect(plugin.getAscotHashParam('http://www.google.com/?abcd=12#ascot=1234')).toEqual('1234');
  });

  it("should htmlify a look properly", function() {
  	var look = {
      title : "My title",
      source : "My Source",
      tags : [
        { product : { brand : "Bonobos", name : "Tiny Prancers", buyLink : "www.google.com" } }
      ]
  	};

    expect(plugin.htmlifyTags(look)).toBe("My title<br>Source: My Source<br><br>1. <a href='www.google.com'><b>Bonobos</b> Tiny Prancers</a>");
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
    expect(ret).toBe("http://www.tumblr.com/share/photo?source=$myurl&clickthru=$http://www.ascotproject.com/look/1234&caption=$1234&tags=ascot");
  });

  it("should generate correct Twitter share url", function() {
    expect(plugin.getTwitterUrl('test')).toBe("https://twitter.com/share?url=test&via=AscotProject");
  });

  it("should generate correct Facebook share url", function() {
    expect(plugin.getFacebookUrl('test')).toBe("https://www.facebook.com/dialog/send?app_id=169111373238111&link=test&redirect_uri=test");
  });

  it("should generate correct Pinterest share url", function() {
    expect(plugin.getPinterestUrl('image', 'test')).toBe('//pinterest.com/pin/create/button/?url=test&media=image&description=From%3A%20test');
  });
});