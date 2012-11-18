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
              res.render('tagger', { title:"Ascot", look : look, key : req.params.key });
            }
          });
        }
      });
    }
  };
};

exports.put = function(url) {
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
              console.log(JSON.stringify(req.body) + "-");
              look.tags = req.body;
              look.save(function(error, savedLook) {
                if (error || !savedLook) {
                  console.log(error);
                  res.render('error', { error : 'Failed to save tags', title : 'Error' });
                } else {
                  res.redirect('/look/' + savedLook._id);
                }
              });
            }
          });
        }
      });
    }
  };
};
