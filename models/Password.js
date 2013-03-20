/**
 *  Password.js
 *
 *  Created on: March 15, 2013
 *      Author: Valeri Karpov
 *
 *  Mongoose model for user passwords. Keep this separate from User collection
 *  so its safe to pass User objects to client side without security concerns.
 *
 */

var Mongoose = require('mongoose');

exports.PasswordSchema = new Mongoose.Schema({
  pw : { type : String, validator : /.+/ }
});
