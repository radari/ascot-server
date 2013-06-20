/*
 *  routes.look.links.js
 *
 *  Created on: June 20, 2013
 *      Author: Valeri Karpov
 *
 *  Nodeunit-based test cases for /routes/links.js
 *
 */

var LinksRoutes = require('../routes/links.js');

exports.testShortened = function(test) {
  var mockShortened = {
    key : '1234',
    url : 'http://test'
  }
  var mockShortener = {
    longify : function(key, callback) {
      test.equal(key, mockShortened.key);
      callback(null, mockShortened.url);
    }
  };

  var f = LinksRoutes.shortened(mockShortener);

  f({ params : { key : '1234' } },
    { render : function(view, params) {
        test.equal(view, 'l');
        test.equal(params.url, mockShortened.url);
        test.expect(3);
        test.done();
      }
    });
};

exports.testReadable = function(test) {
  var mockReadable = {
    readable : 'abcd-1234',
    number : 1,
    url : 'http://test'
  };
  var mockReadify = {
    longify : function(readable, number, callback) {
      test.equal(readable, mockReadable.readable);
      test.equal(number, mockReadable.number);
      callback(null, mockReadable.url);
    }
  };

  var f = LinksRoutes.readable(mockReadify);

  f({ params : { readable : mockReadable.readable, number : mockReadable.number } },
    { redirect : function(url) {
        test.equal(url, mockReadable.url);
        test.expect(3);
        test.done();
      }
    });
};