
describe('TaggedImage', function() {
  it('Should save tags properly', function() {
    var t = new TaggedImage('1234', []);
    expect(t.tags.length).toBe(0);
  });

  it('Should be able to add a tag', function() {
    var t = new TaggedImage('1234', []);
    t.addTag({ 'index' : 3 });
    expect(t.tags.length).toBe(1);
    expect(t.tags[0].index).toBe(3);
  });

  it('Should properly delete a tag', function() {
    var tag1 = { index : 1 };
    var tag2 = { index : 2 };
    var t = new TaggedImage('1234', [tag1, tag2]);
    t.deleteTag(tag1);
    expect(t.tags.length).toBe(1);
    expect(t.tags[0].index).toBe(2);
    t.deleteTag(tag2);
    expect(t.tags.length).toBe(0);
  });
});
