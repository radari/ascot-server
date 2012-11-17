/**
 *  Product.js
 *
 *  Created on: November 17, 2012
 *      Author: Valeri Karpov
 *
 *  Mongoose model for products
 *
 */

var Mongoose = require('mongoose');

exports.ProductSchema = new Mongoose.Schema({
  name : String,
  brand : String,
  type : String,
  buyLink : String,
  price : Number,
  search : [String]
});
