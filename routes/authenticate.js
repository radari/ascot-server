/**
 *  authenticate.js
 *
 *  Created on: February 10, 2013
 *      Author: Matt Green
 *
 *  Methods for dealing with user authentication
 *
 */


exports.login = function(req, res) {
  res.render('login', { title : 'Ascot :: Login', message : req.flash('error') });
};

exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
};

exports.createUser = function(mongoUserFactory) {
  return function(req, res) {
    mongoUserFactory.newUser(
        req.body["username"],
        req.body["email"],
        req.body["password"],
        function(error, user) {
          if (error || !user) {
            req.flash('error', error.error);
            res.redirect('/login');
          } else {
            req.flash('error', 'Registration successful. Please log in');
            res.redirect('/login');
          }
        });
  };
};

exports.strategyFactory = function(mongoUserFactory) {
  return {
    localStrategy : function(username, password, done) {
      mongoUserFactory.authenticatePassword(username, password, function(error, user) {
        if (error || !user) {
          console.log('FAILED ' + JSON.stringify(error));
          return done(null, false, { message : error.error });
        } else {
          console.log('LOGGED IN');
          return done(null, user);
        }
      });
    }, serializeUser : function(user, done) {
      return done(null, user._id);
    }, deserializeUser : function(id, done) {
      mongoUserFactory.findById(id, function(error, user) {
        done(error, user);
      });
    }
  };
};

exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};

exports.administratorValidator = function(Administrator) {
  return function(req, res, next) {
    if (req.isAuthenticated()) {
      Administrator.findOne({ user : req.user._id }, function(error, admin) {
        if (error || !admin) {
          res.redirect('/login');
        } else {
          return next();
        }
      });
    } else {
      res.redirect('/login');
    }
  };
};
