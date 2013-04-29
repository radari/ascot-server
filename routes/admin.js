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

var fs = require('fs');

var gm = require('gm');

/*
 * GET /make/admin/:name.json
 */
exports.makeAdmin = function(Administrator, mongoUserFactory) {
  return function(req, res) {
    mongoUserFactory.findByUsername(req.params.name, function(error, user) {
      if (error || !user) {
        res.json({ error : error });
      } else {
        var a = new Administrator({ user : user._id });
        a.save(function(error, admin) {
          if (error || !admin) {
            res.json({ error : error });
          } else {
            res.json({ success : true });
          }
        });
      }
    });
  };
};

exports.index = function(Look) {
  return function(req, res) {
    var MAX_PER_PAGE = 20;
    var p = req.query["p"] || 0;

    Look.find({}).count(function(error, count) {
      Look.
          find({}).
          sort({ _id : -1 }).
          limit(MAX_PER_PAGE).skip(p * MAX_PER_PAGE).
          exec(function(error, looks) {
            if (error || !looks) {
              res.format({
                  'html' :
                    function() {
                      res.render('error',
                        { title : "Ascot :: Error", error : "Couldn't load looks'" });
                    },
                  'json' :
                    function() {
                      res.json({ error : error });
                    }
              });
            } else {
              res.format({
                  'html' :
                    function() {
                      res.render('admin',
                        { looks : looks,
                          listTitle : 'All Looks',
                          title : 'Ascot :: All Looks',
                          page : p,
                          numPages : Math.ceil((count + 0.0) / (MAX_PER_PAGE + 0.0))});
                    },
                  'json' :
                    function() {
                      res.json({ looks : looks });
                    }
              });
            }
          });
    });
  };
};

exports.users = function(User) {
  return function(req, res) {
    User.find({}).populate('looks').exec(function(error, users) {
      res.render('admin/users', { users : users, title : 'Admin Users' });
    });
  };
};