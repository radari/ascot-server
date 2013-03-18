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
                              email : email,
                              password : password,
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
};