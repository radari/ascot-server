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
});