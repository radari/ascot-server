/**
 *  Administrator.js
 *
 *  Created on: March 19, 2013
 *      Author: Valeri Karpov
 *
 *  Mongoose model for administrator properties
 *
 */

var Mongoose = require('mongoose');

exports.AdministratorSchema = new Mongoose.Schema({
  user : { type : Mongoose.Schema.ObjectId, ref : 'users' }
});
