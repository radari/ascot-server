/**
 *  Permissions.js
 *
 *  Created on: November 17, 2012
 *      Author: Valeri Karpov
 *
 *  Permissions for image editting
 *
 */

var Mongoose = require('mongoose');

exports.PermissionsSchema = new Mongoose.Schema({
  images : [{ type : Mongoose.Schema.ObjectId, ref : 'looks' }]
});
