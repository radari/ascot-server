/**
 *  Look.js
 *
 *  Created on: November 17, 2012
 *      Author: Valeri Karpov
 *
 *  Mongoose model for looks
 *
 */

var Mongoose = require('mongoose');

exports.LookSchema = new Mongoose.Schema({
  title : String,
  url : String,
  search : [String],
  tags : [
    {
      position : { x : Number, y : Number },
      index : Number,
      product : { type : Mongoose.Schema.ObjectId, ref : 'Products' }
    }
  ]
});
