/**
 *  user.js
 *
 *  Created on: March 20, 2013
 *      Author: Valeri Karpov
 *
 *  Routes for logged in user functionality and displaying user profile
 *
 */

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
    req.user.settings = req.body.settings;
    req.user.save(function(error, user) {
      if (error || !user) {
        req.flash('settings', 'Error saving settings : ' + error);
      } else {
        req.flash('settings', 'Settings saved successfully');
      }
      res.redirect('/settings');
    });
  };
};
