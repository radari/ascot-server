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

  var mockValidator = {
    canEditTags : function(user, permissions, look, callback) {
      test.equal(user, mockUser);
      test.equal(permissions.length, 1);
      test.equal(permissions[0], mockPermissions);
      test.equal(look, mockLook._id);
      callback(null, mockPermissions);
    }
  };

  var mockMongoLookFactory = {
    buildFromId : function(id, callback) {
      test.equal(id, mockLook._id);
      callback(null, mockLook);
    }
  };

  var fn = TaggerRoutes.get(displayRoute, mockValidator, mockMongoLookFactory);

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
      test.expect(7);
      test.done();
    }
  });
};