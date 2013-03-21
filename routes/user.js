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
  res.render(
      'settings', { title : 'Ascot :: ' + req.user.username + '\'s settings'} );
};
