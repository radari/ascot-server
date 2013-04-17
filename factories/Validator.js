/**
 *  Validator.js
 *
 *  Created on: November 17, 2012
 *      Author: Valeri Karpov
 *
 *  Validator for ability to add tags to a look
 *
 */

exports.Validator = function(Permissions) {
  this.canEditTags = function(user, keys, lookId, callback) {
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
