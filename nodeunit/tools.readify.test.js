/*
 *  tools.readify.test.js
 *
 *  Created on: April 24, 2013
 *      Author: Valeri Karpov
 *
 *  Nodeunit-based test cases for /routes/tools/readify.js
 *
 */

var readify = require('../routes/tools/readify.js').readify();

exports.testOutput = function(test) {
  var z = readify({ brand : 'Nike', name : 'AIR ZOOm 3'});
  test.equal(z, 'Nike-Air-Zoom-3');
  test.done();
};