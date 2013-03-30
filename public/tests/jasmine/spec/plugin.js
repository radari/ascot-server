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
});