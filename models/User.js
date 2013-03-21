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
  email : { type : String, validate : /.+@.+\..+/ },
  // See Password.js for description of why this is reference
  password : { type : Mongoose.Schema.ObjectId, ref : 'passwords' },
  affiliates : {
    shopsense : {
      enabled : { type : Boolean, default : true },
      // Shopsense key. By default Ascot Project's
      key : { type : String, default : "uid4336-13314844-31" }
    }
  },
  // List of looks this user has permission to tag
  looks : [{ type : Mongoose.Schema.ObjectId, ref : 'looks' }],
  favorites : [{ type : Mongoose.Schema.ObjectId, ref : 'looks' }]
});
