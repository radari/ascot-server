/**
 *  Validator.js
 *
 *  Created on: November 17, 2012
 *      Author: Valeri Karpov
 *
 *  Validator for ability to add tags to a look
 *
 */

var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'ascot');

var LookSchema = require('../models/Look.js').LookSchema;
var Look = db.model('looks', LookSchema);

var PermissionsSchema = require('../models/Permissions.js').PermissionsSchema;
var Permissions = db.model('permissions', PermissionsSchema);

exports.Validator = function() {
  this.canEditTags = function(key, lookId, callback) {
    Permissions.findOne({ _id : key, images : lookId }, function(error, permission) {
      if (error || !permission) {
        callback({ error : {} }, null);
      } else {
        callback(null, true);
      }
    });
  }
};
