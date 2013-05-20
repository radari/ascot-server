/**
 *  Catalog.js
 *
 *  Created on: May 20, 2013
 *      Author: Valeri Karpov
 *
 *  Mongoose model for catalogs
 *
 */

var Mongoose = require('mongoose');

exports.CatalogSchema = new Mongoose.Schema({
  title : { type : String, default : "", required : true },
  // List of looks in this catalog
  looks : [{ type : Mongoose.Schema.ObjectId, ref : 'looks' }],
  owner : { type : Mongoose.Schema.ObjectId, ref : 'users' },
});