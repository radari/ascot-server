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
    Product.find().where('search').in(regexps).exec(function(error, results) {
      res.json(results);
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
          res.render('product_looks', { title : product.name, looks : looks });
        }
      });
    }
  });
};
