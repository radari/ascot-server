/*
 *  routes.tagger.test.js
 *
 *  Created on: April 27, 2013
 *      Author: Valeri Karpov
 *
 *  Nodeunit-based test cases for /routes/tagger.js
 *
 */

var TaggerRoutes = require('../routes/tagger.js');

exports.testGet = function(test) {
  var displayRoute = 'testRoute';

  var mockUser = null;

  var mockPermissions = 'test1234';

  var mockLook = {
    _id : 'testLook'
  };

  var mockMongoLookFactory = {
    buildFromId : function(id, callback) {
      test.equal(id, mockLook._id);
      callback(null, mockLook);
    }
  };

  var fn = TaggerRoutes.get(displayRoute, mockMongoLookFactory);

  fn({
    // req
    params : {
      look : mockLook._id
    },
    cookies : {
      permissions : [mockPermissions]
    }
  }, {
    // res
    render : function(view, params) {
      test.equal(view, displayRoute);
      test.equal(params.look, mockLook);
      test.expect(3);
      test.done();
    }
  });
};

exports.testPutRoute = function(test) {
  var mockUser = null;

  var mockPermissions = 'test1234';

  var mockLook = {
    _id : 'testLook'
  };

  var mockMongoLookFactory = {
    buildFromId : function(id, callback) {
      test.equal(id, mockLook._id);
      callback(null, mockLook);
    }
  };

  var mockGmTagger = function(look, callback) {
    test.equal(look, mockLook);
    callback();
  };

  var mockProductLinkGenerator = function(user, look, callback) {
    test.equal(mockUser, user);
    test.equal(mockLook, look);
    callback(null, look);
  };

  var fn = TaggerRoutes.put(mockMongoLookFactory, mockGmTagger, mockProductLinkGenerator);

  fn({
    // req
    params : {
      look : mockLook._id
    },
    cookies : {
      permissions : [mockPermissions]
    },
    body : {
      tags : [{ product : { brand : 'Nike', name : 'Air Zoom 3' } }],
      title : "Check out my fresh kicks"
    }
  }, {
    // res
    json : function(object) {
      test.equal(object.success, true);
      test.equal(9, mockLook.search.length);
      test.deepEqual(["check", "out", "my", "fresh", "kicks", "nike", "air", "zoom", "3"], mockLook.search);
      test.expect(7);
      test.done();
    }
  });
};
