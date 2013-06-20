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
    })
};