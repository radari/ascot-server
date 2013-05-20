/**
 *  user.js
 *
 *  Created on: March 20, 2013
 *      Author: Valeri Karpov
 *
 *  Routes for logged in user functionality and displaying user profile
 *
 */

// Middleware for loading by user
exports.byUsername = function(mongoUserFactory) {
  return function(req, res, next) {
    mongoUserFactory.findByUsername(req.params.user, function(error, user) {
      if (error || !user) {
        res.render('error', { title : 'Ascot :: Error', error : 'User ' + req.params.user + ' not found.' });
      } else {
        req.requestedUser = user;
        next();
      }
    });
  };
};

exports.home = function(req, res) {
  res.render('home', { title : 'Ascot :: ' + req.user.username });
};

exports.settings = function(req, res) {
  res.render('settings',
      { title : 'Ascot :: ' + req.user.username + '\'s settings',
        message : req.flash('settings')
      } );
};

exports.saveSettings = function(User) {
  return function(req, res) {
    req.user.settings = req.body;
    req.user.save(function(error, user) {
      if (error || !user) {
        res.json({ error : error });
      } else {
        res.json({ success : true });
      }
    });
  };
};

/*
 * GET /delete/user/:name.json
 */
exports.delete = function(mongoUserFactory) {
  return function(req, res) {
    mongoUserFactory.findByUsername(req.params.name, function(error, user) {
      if (error || !user) {
        res.json({ error : error });
      } else {
        user.remove(function(error) {
          if (error) {
            res.json({ error : error });
          } else {
            res.json({ success : true });
          }
        });
      }
    });
  };
};
