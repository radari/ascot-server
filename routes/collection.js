/**
 *  collection.js
 *
 *  Created on: May 20, 2013
 *      Author: Valeri Karpov
 *
 *  Collection-specific routes
 *
 */

exports.collectionById = function(Collection) {
  return function(req, res, next) {
    Collection.
      findOne({ _id : req.params.collection }).
      populate('looks').
      populate('owner').
      exec(function(error, collection) {
        if (error || !collection) {
          res.render('error', { title : 'Ascot :: Error', error : 'Collection not found' });
        } else {
          req.collection = collection;
          next();
        }
      });
  };
};

/*
 * GET /collections
 */
exports.getCollections = function(Collection) {
  return function(req, res) {
    Collection.
        find({}).
        populate('looks').
        populate('owner').
        exec(function(error, collections) {
          res.render('collections', { title : 'Ascot :: Collections', collections : collections });
        });
  };
};

/*
 * GET /user/:user/collection/:collection
 */
exports.get = function(Collection) {
  return function(req, res) {
    var title = decodeURIComponent(req.params.collection).replace('-', ' ');
    Collection.
        findOne({ title : title, owner : req.requestedUser }).
        populate('looks').
        populate('owner').
        exec(function(error, collection) {
          if (error || !collection) {
            res.render('error', { title : 'Ascot :: Error', error : 'Error - ' + error });
          } else {
            res.render('collection', { title : 'Ascot :: ' + collection.title, collection : collection });
          }
        });
  }
};
