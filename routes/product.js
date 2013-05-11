/**
 *  product.js
 *
 *  Created on: February 4, 2012
 *      Author: Valeri Karpov
 *
 *  Some product-specific routes
 *
 */

/*
 * GET /brands.json?query=<query>
 */
exports.brands = function(Look) {
  return function(req, res) {
    Look.distinct('tags.product.brand').
      where('tags.product.brand').
      regex(new RegExp(req.query["query"], "i")).
      exec(function(error, brands) {
        var ret = [];
        var MAX = 5;
        for (var i = 0; i < brands.length; ++i) {
          if (brands[i].toLowerCase().indexOf(req.query["query"].toLowerCase()) != -1) {
            ret.push(brands[i]);
          }

          if (ret.length >= MAX) {
            break;
          }
        }

        res.json(ret);
      });
  };
};

/*
 * GET /names.json?query=<query>
 */
exports.names = function(Look) {
  return function(req, res) {
    Look.distinct('tags.product.name').
      where('tags.product.name').
      regex(new RegExp(req.query["query"], "i")).
      exec(function(error, names) {
        var ret = [];
        var MAX = 5;
        for (var i = 0; i < names.length; ++i) {
          if (names[i].toLowerCase().indexOf(req.query["query"].toLowerCase()) != -1) {
            ret.push(names[i]);
          }

          if (ret.length >= MAX) {
            break;
          }
        }

        res.json(ret);
      });
  };
};

/*
 * GET /links.json?brand=<brand>&name=<name>
 */
exports.links = function(Look) {
  return function(req, res) {
    if (!req.query.brand || !req.query.name) {
      res.json([]);
      return;
    }

    Look.find({ 'tags.product.brand' : req.query.brand, 'tags.product.name' : req.query.name }, function(error, looks) {
      var ret = [];
      var MAX = 7;
      for (var i = 0; i < looks.length; ++i) {
        for (var j = 0; j < looks[i].tags.length; ++j) {
          if (looks[i].tags[j].product.brand == req.query.brand && looks[i].tags[j].product.name == req.query.name) {
            ret.push(looks[i].tags[j].product.buyLink);
          }

          if (ret.length >= MAX) {
            break;
          }
        }
      }

      res.json(ret);
    });
  };
};