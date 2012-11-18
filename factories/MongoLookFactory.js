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

var PermissionsSchema = require('../models/Permissions.js').PermissionsSchema;
var Permissions = db.model('permissions', PermissionsSchema);

exports.MongoLookFactory = function(url) {
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

  this.newLook = function(title, callback) {
    var look = new Look({ title : title, url : "", search : title.toLowerCase().match(/[a-z]+\s*/gi), tags : [] });
    look.save(function(error, savedLook) {
      if (error || !savedLook) {
        callback(error, null);
      } else {
        look.url = url + '/images/uploads/' + look._id + '.png';
        look.save(function(error, savedLookWithUrl) {
          if (error || !savedLookWithUrl) {
            callback(error, null);
          } else {
            var permission = new Permissions({ images : [ savedLookWithUrl._id ] });
            permission.save(function(error, perms) {
              if (error || !perms) {
                callback(error, null);
              } else {
                callback(null, savedLookWithUrl, perms);
              }
            });
          }
        });
      }
    });
  };
};
