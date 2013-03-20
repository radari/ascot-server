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