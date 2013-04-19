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
  var mockRandom = function() { return 0; };

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

  var shortener = Shortener(Shortened, myUrl, mockRandom);
  shortener.shorten(longUrl, function(error, result) {
    test.equal(result, myUrl + '/l/' + mockKey);
    test.expect(4);
    test.done();
  });
};

exports.testFailTwice = function(test) {
  var myUrl = 'http://te.st';
  var longUrl = 'http://www.ascotproject.com';
  var mockKeyBad = 'aaaaa';
  var mockKeyGood = '-----';

  var numCalls = 0;
  var mockRandom = function() { return ++numCalls < 11 ? 0 : 0.999; };

  var Shortened = function(object) {
    test.equal(object.key, mockKeyGood);
    test.equal(object.url, longUrl);

    this.key = object.key;
    this.url = object.url;

    this.save = function(callback) {
      callback(null, this);
    };
  };

  var existent = { key : mockKeyBad, url : 'http://doesntmatter' };

  Shortened.findOne = function(query, callback) {
    if (mockKeyBad == query.key) {
      callback(null, existent);
    } else if (mockKeyGood == query.key) {
      callback(null, null);
    } else {
      test.equal(0, 1);
      test.done();
    }
  };

  var shortener = Shortener(Shortened, myUrl, mockRandom);
  shortener.shorten(longUrl, function(error, result) {
    test.equal(result, myUrl + '/l/' + mockKeyGood);
    test.expect(3);
    test.done();
  });
};