/*
 *  routes.look.admin.js
 *
 *  Created on: May 1, 2013
 *      Author: Valeri Karpov
 *
 *  Nodeunit-based test cases for /routes/admin.js
 *
 */

var AdminRoutes = require('../routes/admin.js');

exports.testDelete = function(test) {
  var mockLook = {
    _id : 'testLook'
  };

  var mockMongoLookFactory = {
    buildFromId : function(id, callback) {
      test.equal(id, mockLook._id);
      callback(null, mockLook);
    }
  };

  var user1 = {
    looks : [mockLook._id],
    favorites : []
  };

  var user2 = {
    looks : [],
    favorites : [mockLook._id]
  };

  var permission = {
    images : [mockLook._id, 'otherId']
  };

  mockLook.remove = user1.save = user2.save = permission.save = function(callback) {
    test.equal('A', 'A');
    callback();
  };

  // Mock this in, because Mongoose lists have this method while Javascript lists don't
  user1.looks.remove =
      user1.favorites.remove =
      user2.looks.remove =
      user2.favorites.remove =
      permission.images.remove = function(value) {
        for (var i = 0; i < this.length; ++i) {
          if (this[i] == value) {
            this.splice(i, 1);
          }
        }
      };

  var User = {
    find : function(query, callback) {
      test.equal(query.$or.length, 2);
      test.equal(query.$or[0].looks, mockLook._id);
      test.equal(query.$or[1].favorites, mockLook._id);
      callback(null, [
        user1,
        user2
      ]);
    }
  };

  var Permissions = {
    find : function(query, callback) {
      test.equal(query.looks, mockLook._id);
      callback(null, [permission]);
    }
  };

  var fn = AdminRoutes.deleteLook(mockMongoLookFactory, User, Permissions);

  fn({
    // req
    params : {
      id : mockLook._id
    }
  }, {
    // res
    json : function(result) {
      test.equal(result.success, true);
      test.equal(user1.looks.length, 0);
      test.equal(user2.favorites.length, 0);
      test.equal(permission.images.length, 1);
      test.equal(permission.images[0], 'otherId');
      test.expect(14);
      test.done();
    }
  });
};