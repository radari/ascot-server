/**
 *  Collection.js
 *
 *  Created on: May 20, 2013
 *      Author: Valeri Karpov
 *
 *  Mongoose model for collections (e.g. catalogs)
 *
 */

var Mongoose = require('mongoose');

exports.CollectionSchema = new Mongoose.Schema({
  title : { type : String, default : "", required : true },
  // List of looks in this collection
  looks : [{ type : Mongoose.Schema.ObjectId, ref : 'looks' }],
  owner : { type : Mongoose.Schema.ObjectId, ref : 'users' },
});
