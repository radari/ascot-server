/**
 *  products.js
 *
 *  Created on: November 17, 2012
 *      Author: Valeri Karpov
 *
 *  Route for searching for products
 *
 */

var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'ascot');

var ProductSchema = require('../models/Product.js').ProductSchema;
var Product = db.model('products', ProductSchema);

var LookSchema = require('../models/Look.js').LookSchema;
var Look = db.model('looks', LookSchema);

exports.get = function(req, res) {
  if (req.query["query"]) {
    var sp = req.query["query"].toLowerCase().split(/\s+/);
    var regexps = [];
    for (var i = 0; i < sp.length; ++i) {
      regexps.push(new RegExp('^' + sp[i], 'i'));
    }
    Product.find().where('search').all(regexps).limit(7).exec(function(error, results) {
      var ret = {};
      ret["query"] = req.query["query"];
      ret["suggestions"] = [];
      ret["data"] = [];
      for (var i = 0; i < results.length; ++i) {
        ret["suggestions"].push(results[i].name + ' from ' + results[i].brand + ' (' + results[i].type + ')');
        ret["data"].push(results[i]);
      }
      res.json(ret);
    });
  } else {
    res.json([]);
  }
};

exports.looks = function(req, res) {
  Product.findOne({ _id : req.params.id }, function(error, product) {
    if (error || !product) {
      res.render('error', { title : 'Error', error : 'Product not found' });
    } else {
      Look.find({ 'tags.product' : req.params.id }, function(error, looks) {
        if (error || !looks) {
          res.render('error', { title : 'Error', error : 'Failed' });
        } else {
          res.render('product_looks', { title : 'Ascot', looks : looks });
        }
      });
    }
  });
};

exports.filters = function(req, res) {
  var ret = {};
  ret["query"] = req.query["query"];
  ret["suggestions"] = [];
  ret["data"] = [];
  Product.distinct('brand').where('brand').regex(new RegExp('^' + req.query["query"], "i")).exec(function(error, products) {
    for (var i = 0; i < products.length; ++i) {
      ret["data"].push({ v : products[i], type : 'Brand' });
      ret["suggestions"].push(products[i] + " (Brand)");
    }
    Product.distinct('type').where('type').regex(new RegExp('^' + req.query["query"], "i")).exec(function(error, products) {
      for (var i = 0; i < products.length; ++i) {
        ret["data"].push({ v : products[i], type : 'Type' });
        ret["suggestions"].push(products[i] + " (Type)");
      }
      res.json(ret);
    });
  });
};
