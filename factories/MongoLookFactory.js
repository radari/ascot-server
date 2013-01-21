/**
 *  MongoLookFactory.js
 *
 *  Created on: November 17, 2012
 *      Author: Valeri Karpov
 *
 *  Interface to MongoDB for the Look model
 *
 */

var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'ascot');

var LookSchema = require('../models/Look.js').LookSchema;
var Look = db.model('looks', LookSchema);

var PermissionsSchema = require('../models/Permissions.js').PermissionsSchema;
var Permissions = db.model('permissions', PermissionsSchema);

exports.MongoLookFactory = function(url) {
  this.buildFromUrl = function(url, callback) {
    Look.findOne({ url : url }).exec(function(error, result) {
      if (error || !result) {
        callback(error, null);
      } else {
        callback(null, result);
      }
    });
  };

  this.buildFromId = function(id, callback) {
    Look.findOne({ _id : id }).exec(function(error, result) {
      if (error || !result) {
        callback(error, null);
      } else {
        callback(null, result);
      }
    });
  };

  this.newLook = function(callback) {
    var look = new Look({ url : "", search : [], tags : [], random : [Math.random(), 0] });
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

  this.newLookWithUrl = function(url, callback) {
    var look = new Look({ url : url,
                          search : [],
                          tags : [],
                          random : [Math.random(), 0],
                          source : url });

    look.save(function(error, savedLook) {
      if (error || !savedLook) {
        callback(error, null);
      } else {
        var permission = new Permissions({ images : [ savedLook._id ] });
        permission.save(function(error, perms) {
          if (error || !perms) {
            callback(error, null);
          } else {
            callback(null, savedLook, perms);
          }
        });
      }
    });
  };
  
  this.setHeightAndWidth = function(id, height, width, callback) {
    Look.findOne({ _id : id }).exec(function(error, look) {
      if (error || !look) {
        callback(error, null);
      } else {
        console.log("GOT HEIGHT=" + height + " & WiDTH=" + width);
        look.size.height = height;
        look.size.width = width;
        look.save(function(error, look) {
          if (error || !look) {
            callback(error, null);
          } else {
            callback(null, look);
          }
        })
      }
    });
  };
};
