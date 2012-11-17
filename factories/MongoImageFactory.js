/**
 *  MongoLookFactory.js
 *
 *  Created on: November 17, 2012
 *      Author: Valeri Karpov
 *
 *  Interface to MongoDB for the Look and Product models
 *
 */

var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', ascot);

var ProductSchema = require('../models/Product.js');
var Product = db.model('Products', ProductSchema);

var LookSchema = require('../models/Look.js');
var Look = db.model('Looks', LookSchema);

exports.MongoLookFactory = function() {
  this.buildFromUrl = function(url, callback) {
    Look.findOne({ url : url }).populate('tags.product').exec(function(error, result) {
      if (error || !result) {
        callback(error, null);
      } else {
        callback(null, result);
      }
    });
  };
};
