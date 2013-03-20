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
      key : { type : String, default : "" }
    }
  },
  // List of looks this user has permission to tag
  looks : [{ type : Mongoose.Schema.ObjectId, ref : 'looks' }],
  favorites : [{ type : Mongoose.Schema.ObjectId, ref : 'looks' }]
});
