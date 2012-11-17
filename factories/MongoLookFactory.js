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
    Look.findOne({ url : url }).populate('tags.product').exec(function(error, result) {
      if (error || !result) {
        callback(error, null);
      } else {
        callback(null, result);
      }
    });
  };

  this.buildFromId = function(id, callback) {
    Look.findOne({ _id : id }).populate('tags.product').exec(function(error, result) {
      if (error || !result) {
        callback(error, null);
      } else {
        callback(null, result);
      }
    });
  };

  this.newLook = function(title, url, callback) {
    var look = new Look({ title : title, url : url, search : title.toLowerCase().match(/[a-z]+\s*/gi), tags : [] });
    look.save(function(error, savedLook) {
      if (error || !savedLook) {
        callback(error, null);
      } else {
        callback(null, savedLook);
      }
    });
  };
};
