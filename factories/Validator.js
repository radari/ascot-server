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
  this.canEditTags = function(user, keys, lookId, callback) {
    console.log("** Checking for " + lookId + " in " + JSON.stringify(user.looks));
    if (user && user.looks && user.looks.indexOf(lookId) != -1) {
      callback(null, true);
    } else {
      Permissions.findOne({ _id : { $in : keys }, images : lookId }, function(error, permission) {
        if (error || !permission) {
          callback({ error : {} }, null);
        } else {
          callback(null, true);
        }
      }); 
    }
  }
};
