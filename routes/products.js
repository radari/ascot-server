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

exports.get = function(req, res) {
  if (req.query["query"]) {
    var sp = req.query["query"].toLowerCase().match(/[a-z]+\s*/i);
    var regexps = [];
    for (var i = 0; i < sp.length; ++i) {
      regexps.push(new RegExp('^' + sp[i], 'i'));
    }
    Product.find().where('search').in(regexps).exec(function(error, results) {
      res.json(results);
    });
  } else {
    // TODO : error page
  }
};
