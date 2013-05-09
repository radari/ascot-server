/**
 *  User.js
 *
 *  Created on: March 15, 2013
 *      Author: Valeri Karpov
 *
 *  Mongoose model for users
 *
 */

var Mongoose = require('mongoose');

exports.UserSchema = new Mongoose.Schema({
  username : { type : String, index : { unique : true }, validate : /.+/ },
  // Configurable settings
  settings : {
    email : { type : String, validate : /.+@.+\..+/ },
    sendUpdates : { type : Boolean, default : true },
    // See Password.js for description of why this is reference
    password : { type : Mongoose.Schema.ObjectId, ref : 'passwords' },
    affiliates : {
      shopsense : {
        enabled : { type : Boolean, default : true },
        // Shopsense key. By default Ascot Project's
        key : { type : String, default : "uid4336-13314844-31" }
      },
      linkshare : {
        enabled : { type : Boolean, default : true },
        key : { type : String, default : "b59b94c0621af2ba72ddc0b24e16dfa805c0b8056df90e2de5622c6713698ba6" }
      }
    }
  },
  defaultViewConfig : [ViewConfigSchema],
  // List of looks this user has permission to tag
  looks : [{ type : Mongoose.Schema.ObjectId, ref : 'looks' }],
  // User's favorites
  favorites : [{ type : Mongoose.Schema.ObjectId, ref : 'looks' }]
});
