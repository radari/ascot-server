/**
 *  admin.js
 *
 *  Created on: February 10, 2012
 *      Author: Matt Green
 *
 *  Routes for an admin interface
 *
 */

var authenticate = require('./authenticate.js');

exports.index = function(req, res) {
  authenticate.ensureAuthenticated(req, res, function() {
    res.render('admin', { title : 'Ascot :: admin' });
  });
};