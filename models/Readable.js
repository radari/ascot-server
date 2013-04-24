/**
 *  Readable.js
 *
 *  Created on: April 24, 2013
 *      Author: Valeri Karpov
 *
 *  Model for our readable URL generator
 *
 */

var Mongoose = require('mongoose');

exports.ReadableSchema = new Mongoose.Schema({
  readable : { type : String },
  number : { type : Number },
  url : { type : String }
});
