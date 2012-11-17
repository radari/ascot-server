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
var db = Mongoose.createConnection('localhost', 'ascot');

var ProductSchema = require('../models/Product.js').ProductSchema;
var Product = db.model('products', ProductSchema);

var LookSchema = require('../models/Look.js').LookSchema;
var Look = db.model('looks', LookSchema);

exports.MongoLookFactory = function() {
  this.buildFromUrl = function(url, callback) {
    Look.findOne({ url : url }, function(error, result) {
      if (error || !result) {
        console.log("Error " + JSON.stringify(error) + "---");
        callback(error, null);
      } else {
        callback(null, result);
      }
    });
  };
};
