/**
 *  catalog.js
 *
 *  Created on: May 20, 2013
 *      Author: Valeri Karpov
 *
 *  Catalog-specific routes
 *
 */

/*
 * GET /u/:user/catalog/:catalog
 */
exports.get = function(Catalog) {
  return function(req, res) {
    var title = decodeURIComponent(req.params.catalog).replace('-', ' ');
    Catalog.
        findOne({ title : title, owner : req.requestedUser }).
        populate('looks').
        populate('owner').
        exec(function(error, catalog) {
          if (error || !catalog) {
            res.render('error', { title : 'Ascot :: Error', error : 'Error - ' + error });
          } else {
            res.render('catalog', { catalog : catalog });
          }
        });
  }
};