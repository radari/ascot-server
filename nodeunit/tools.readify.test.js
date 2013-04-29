/*
 *  tools.readify.test.js
 *
 *  Created on: April 24, 2013
 *      Author: Valeri Karpov
 *
 *  Nodeunit-based test cases for /routes/tools/readify.js
 *
 */

var Readify = require('../routes/tools/readify.js').readify;

exports.testOutput = function(test) {
  var mockProduct = {
    brand : 'Nike',
    name : 'AIR ZOOM 3'
  };

  var mockResult = 'Nike-Air-Zoom-3';
  var mockUrl = 'http://nike.tk/longUrlHere';

  var Readable = function(object) {
    test.equal(object.readable, mockResult);
    test.equal(object.number, 3);
    test.equal(object.url, mockUrl);

    this.readable = object.readable;
    this.number = object.number;
    this.url = object.url;

    this.save = function(callback) {
      callback(null, this);
    };
  };

  Readable.find = function(query, callback) {
    test.equal(query.readable, mockResult);
    callback(null, [1, 2]);
  };

  var readify = Readify(Readable, 'http://test');

  readify.readify(mockProduct, mockUrl, function(error, result) {
    test.equal('http://test/p/Nike-Air-Zoom-3/3', result);
    test.expect(5);
    test.done();
  });
};

exports.testLongify = function(test) {
  var mockReadable = {
    readable : 'test',
    number : 1,
    url : 'http://www.ascotproject.com'
  };

  var Readable = {
    findOne : function(query, callback) {
      test.equal(query.readable, mockReadable.readable);
      test.equal(query.number, mockReadable.number);
      callback(null, mockReadable);
    }
  };

  var readify = Readify(Readable, 'http://test');

  readify.longify(mockReadable.readable, mockReadable.number, function(error, response) {
    test.equal(response, mockReadable.url);
    test.expect(3);
    test.done();
  });
};