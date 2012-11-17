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
var db = Mongoose.createConnection('localhost', 'test');

var ProductSchema = require('../models/Product.js').ProductSchema;
var Product = db.model('Products', ProductSchema);

var LookSchema = require('../models/Look.js').LookSchema;
var Look = db.model('Looks', LookSchema);

exports.MongoLookFactory = function() {
  this.buildFromUrl = function(url, callback) {
    console.log("url " + url);
    /*Look.findOne({ url : url }, function(error, result) {
      if (error || !result) {
        console.log("Error " + JSON.stringify(error) + "---");
        callback(error, null);
      } else {
        console.log("Good cb");
        callback(null, result);
      }
    });*/
    Product.findOne({ _id : "50a7e13e1dc0b440b7fde290" }, function(error, result) {
      console.log("&&" + JSON.stringify(result));
      if (error || !result) {
        console.log("Error " + JSON.stringify(error) + "---");
        callback(error, null);
      } else {
        console.log("Good cb");
        callback(null, result);
      }
    });
  };
};
