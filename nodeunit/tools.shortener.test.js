/*
 *  tools.shortener.test.js
 *
 *  Created on: April 19, 2013
 *      Author: Valeri Karpov
 *
 *  Nodeunit-based test cases for /routes/tools/shortener.js
 *
 */

var Shortener = require('../routes/tools/shortener.js').shortener;

exports.testSucceedFirstTime = function(test) {
  var myUrl = 'http://te.st';
  var longUrl = 'http://www.ascotproject.com';
  var mockKey = 'aaaaa';

  var Shortened = function(object) {
    test.equal(object.key, mockKey);
    test.equal(object.url, longUrl);

    this.key = object.key;
    this.url = object.url;

    this.save = function(callback) {
      callback(null, this);
    };
  };

  Shortened.findOne = function(query, callback) {
    test.equal(query.key, mockKey);
    callback(null, null);
  };

  var shortener = Shortener(Shortened, myUrl, function() { return 0; });
  shortener.shorten(longUrl, function(error, result) {
    test.equal(result, myUrl + '/l/' + mockKey);
    test.expect(4);
    test.done();
  });
};