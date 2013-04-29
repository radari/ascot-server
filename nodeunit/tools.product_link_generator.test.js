/**
 *  tools.product_link_generator.test.js
 *
 *  Created on: April 27, 2013
 *      Author: Valeri Karpov
 *
 *  Nodeunit-based test cases for /tools/product_link_generator.js
 *
 */

var ProductLinkGenerator = require('../routes/tools/product_link_generator.js').ProductLinkGenerator;

exports.testWalkthrough = function(test) {
  var mockShortenedUrl = 'http://test1';
  var mockReadableUrl = 'http://read-me';
  var mockShopsenseUrl = 'http://api.shopstyle';

  var mockLook = {
    tags : [
      { product : { brand : 'Nike', name : 'Air Zoom 3', buyLink : 'http://www.google.com' } },
      { product : { brand : 'Bonobos', name : 'Tiny Prancers', buyLink : 'http://bonobos.com'} },
      { product : { brand : 'J Crew', name : 'Sweater' } }
    ],
    save : function(callback) {
      test.equal('A', 'A');
      callback(null, mockLook);
    }
  };

  var shortenerCount = 0;
  var mockShortener = {
    shorten : function(url, callback) {
      test.equal(url, mockLook.tags[shortenerCount++].product.buyLink);
      callback(null, mockShortenedUrl);
    }
  };

  var readifyCount = 0;
  var mockReadify = {
    readify : function(product, url, callback) {
      test.equal(product, mockLook.tags[readifyCount].product);
      test.equal(url, mockLook.tags[readifyCount++].product.buyLink);
      callback(null, mockReadableUrl);
    }
  };

  var shopsenseCount = 0;
  var mockShopsense = function(key, url, callback) {
    test.equal(key, 'uid4336-13314844-31');
    test.equal(url, mockLook.tags[shopsenseCount++].product.buyLink);
    callback(null, url.length > 0 ? mockShopsenseUrl : '');
  };

  var generator = ProductLinkGenerator(mockShortener, mockReadify, mockShopsense);

  generator(null, mockLook, function(error, look) {
    test.equal(mockLook, look);
    test.equal(mockShopsenseUrl, look.tags[0].product.buyLink);
    test.equal(mockShortenedUrl, look.tags[0].product.buyLinkMinified);
    test.equal(mockReadableUrl, look.tags[0].product.buyLinkReadable);

    test.equal(mockShopsenseUrl, look.tags[1].product.buyLink);
    test.equal(mockShortenedUrl, look.tags[1].product.buyLinkMinified);
    test.equal(mockReadableUrl, look.tags[1].product.buyLinkReadable);

    test.equal(undefined, look.tags[2].product.buyLink);
    test.equal(mockShortenedUrl, look.tags[2].product.buyLinkMinified);
    test.equal(mockReadableUrl, look.tags[2].product.buyLinkReadable);

    test.expect(24);
    test.done();
  });
};