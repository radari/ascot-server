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
var mongoLookFactory = new MongoLookFactory();

var Validator = require('../factories/Validator.js').Validator;
var validator = new Validator();

exports.get = function(req, res) {
  if (req.params.key && req.params.look) {
    validator.canEditTags(req.params.key, req.params.look, function(error, permission) {
      if (error || !permission) {
        res.render('error', { error : 'Access Denied', title : 'Error' });
      } else {
        mongoLookFactory.buildFromId(req.params.look, function(error, look) {
          if (error || !look) {
            res.render('error', { error : 'Internal failure', title : 'Error' });
          } else {
            res.render('tagger', { title : look.title, look : look });
          }
        });
      }
    });
  }
};

exports.post = function(req, res) {
  if (req.params.key && req.params.look) {
    validator.canEditTags(req.params.key, req.params.look, function(error, permission) {
      if (error || !permission) {
        res.render('error', { error : 'Access Denied', title : 'Error' });
      } else {
        mongoLookFactory.buildFromId(req.params.look, function(error, look) {
          if (error || !look) {
            res.render('error', { error : 'Internal failure', title : 'Error' });
          } else {
            look.tags = req.body.tags;
            look.save(function(error, savedLook) {
              if (error || !savedLook) {
                res.render('error', { error : 'Failed to save tags', title : 'Error' });
              } else {
                res.render('/look/' + savedLook._id);
              }
            });
          }
        });
      }
    });
  }
};
