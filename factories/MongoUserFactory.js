/**
 *  MongoUserFactory.js
 *
 *  Created on: March 18, 2013
 *      Author: Valeri Karpov
 *
 *  Interface to MongoDB for creating Users from Mongoose model
 *
 */

exports.MongoUserFactory = function(User, Password) {
  this.newUser = function(username, email, password, callback) {
    var password = new Password({ pw : password });
    password.save(function(error, password) {
      if (error || !password) {
        callback({ error : 'Failed to save password' }, null);
      } else {
        var user = new User({ username : username, 
                              settings : {
                                email : email,
                                password : password
                              },
                              looks : [],
                              favorites : [] });

        user.save(function(error, user) {
          if (error || !user) {
            callback({ error : 'Failed to create user : ' + error }, null);
          } else {
            callback(null, user);
          }
        });
      }
    });
  };

  this.findByUsername = function(username, callback) {
    User.findOne({ username : username }, function(error, user) {
      if (error || !user) {
        callback({ error : 'User not found' }, null);
      } else {
        callback(null, user);
      }
    });
  };

  this.findById = function(id, callback) {
    User.findOne({ _id : id }, function(error, user) {
      if (error || !user) {
        callback({ error : 'User not found' }, null);
      } else {
        callback(null, user);
      }
    });
  };

  // Note - this returns user WITH password populated, be careful with this one
  this.authenticatePassword = function(username, password, callback) {
    console.log('c ' + username + ' ' + password);
    User.
        findOne({ username : username }).
        populate('settings.password').exec(function(error, user) {
          if (error || !user) {
            callback({ error : 'User not found' }, null);
          } else if (password.toString() == user.settings.password.pw.toString()) {
            callback(null, user);
          } else {
            callback({ error : 'Password incorrect' }, null);
          }
        });
  };
};