/**
 *  Shortened.js
 *
 *  Created on: April 18, 2013
 *      Author: Valeri Karpov
 *
 *  Model for our own URL shortener
 *
 */

var Mongoose = require('mongoose');

exports.ShortenedSchema = new Mongoose.Schema({
  key : { type : String, index : { unique : true } },
  url : { type : String }
});
