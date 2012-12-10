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
  title : { type : String, default : "Untitled Look" },
  url : String,
  random : [{ type : Number, default : Math.random() }, { type : Number, default : 0 }],
  source : { type : String, default : "" },
  search : [String],
  tags : [
    {
      position : { x : Number, y : Number },
      index : Number,
      product : { type : Mongoose.Schema.ObjectId, ref : 'products' }
    }
  ]
});

exports.LookSchema.index({ random : '2d' });
