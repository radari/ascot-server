/**
 *  tagger.js
 *
 *  Created on: November 17, 2012
 *      Author: Valeri Karpov
 *
 *  Modify tags for an image
 *
 */

var MongoLookFactory = require('../factories/MongoLookFactory.js').MongoLookFactory;

var Validator = require('../factories/Validator.js').Validator;
var validator = new Validator();

/*
 * GET /tagger/:key/:look
 */
exports.get = function(url) {
  var mongoLookFactory = new MongoLookFactory(url);
  return function(req, res) {
    if (req.params.key && req.params.look) {
      validator.canEditTags(req.params.key, req.params.look, function(error, permission) {
        if (error || !permission) {
          res.render('error', { error : 'Access Denied', title : 'Error' });
        } else {
          mongoLookFactory.buildFromId(req.params.look, function(error, look) {
            if (error || !look) {
              res.render('error', { error : 'Internal failure', title : 'Error' });
            } else {
              res.render('tagger', { title: "Ascot :: Image Tagger", look : look, key : req.params.key });
            }
          });
        }
      });
    }
  };
};

/*
 * PUT /tagger/:key/:look
 */
exports.put = function(url) {
  var mongoLookFactory = new MongoLookFactory(url);
  return function(req, res) {
    if (req.params.key && req.params.look) {
      validator.canEditTags(req.params.key, req.params.look, function(error, permission) {
        if (error || !permission) {
          res.render('error', { error : 'Access Denied', title : 'Ascot :: Error' });
        } else {
          mongoLookFactory.buildFromId(req.params.look, function(error, look) {
            if (error || !look) {
              res.render('error', { error : 'Internal failure', title : 'Ascot :: Error' });
            } else {
              console.log(JSON.stringify(req.body) + "-" + req.body);
              look.tags = req.body.tags;
              look.title = req.body.title;
              look.source = req.body.source;
              look.save(function(error, savedLook) {
                if (error || !savedLook) {
                  console.log(error);
                  res.render('error', { error : 'Failed to save tags', title : 'Ascot :: Error' });
                } else {
                  // Return nothing, client should handle this how it wants
                  res.json({});
                }
              });
            }
          });
        }
      });
    }
  };
};
