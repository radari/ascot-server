/**
 *  admin.js
 *
 *  Created on: February 10, 2012
 *      Author: Matt Green
 *
 *  Routes for an admin interface
 *
 */

var authenticate = require('./authenticate.js');
var createLookImageSizer = require('../public/common/LookImageSizer').createLookImageSizer;

var MongoLookFactory = require('../factories/MongoLookFactory.js').MongoLookFactory;
var fs = require('fs');

var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'ascot');

var LookSchema = require('../models/Look.js').LookSchema;
var Look = db.model('looks', LookSchema);

var gm = require('gm');

exports.index = function(req, res) {
  var MAX_PER_PAGE = 20;
  var p = req.query["p"] || 0;

  Look.find({}).count(function(error, count) {
    Look.
        find({}).
        sort({ _id : -1 }).
        limit(MAX_PER_PAGE).skip(p * MAX_PER_PAGE).
        exec(function(error, looks) {
          if (error || !looks) {
            res.render('error',
                { title : "Ascot :: Admin :: Error", error : "Admin - Couldn't load looks'" });
          } else {
            res.render('admin',
                { 
                  looks : looks,
                  listTitle : 'Admin - All Looks',
                  title : 'Ascot :: Admin',
                  routeUrl : '/admin?',
                  page : p,
                  sizer : createLookImageSizer(looks, 5, 780),
                  numPages : Math.ceil((count + 0.0) / (MAX_PER_PAGE + 0.0)),
                  user : req.user 
                });
          }
        });
  });
};



  
  
