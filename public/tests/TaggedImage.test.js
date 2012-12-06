
describe('TaggedImage', function() {
  it('Should save tags properly', function() {
    var t = new TaggedImage('1234', []);
    expect(t.tags.length).toBe(0);
  });
});
