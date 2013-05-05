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

var addLookToUser = function(user, look, callback) {
  if (user && user.looks && user.looks.indexOf(look._id) == -1) {
    user.looks.push(look._id);
    user.save(function(error, user) {
      callback(null, user);
    });
  } else {
    callback(null, user);
  }
};

/*
 * GET /tagger/:look
 */
exports.get = function(displayRoute, validator, mongoLookFactory) {
  return function(req, res) {
    validator.canEditTags(req.user, req.cookies.permissions || [], req.params.look, function(error, permission) {
      if (error || !permission) {
        res.render('error', { error : 'Access Denied', title : 'Error' });
      } else {
        mongoLookFactory.buildFromId(req.params.look, function(error, look) {
          if (error || !look) {
            res.render('error', { error : 'Internal failure', title : 'Error' });
          } else {
            addLookToUser(req.user, look, function(error, user) {
              res.render(displayRoute, { title: "Ascot :: Image Tagger", look : look });
            });
          }
        });
      }
    });
  };
};

/*
 * PUT /tagger/:look
 */
exports.put = function(validator, mongoLookFactory, gmTagger, productLinkGenerator) {
  return function(req, res) {
    if (req.params.look) {
      validator.canEditTags(req.user,
                            req.cookies.permissions || [],
                            req.params.look,
                            function(error, permission) {
        if (error || !permission) {
          res.render('error', { error : 'Access Denied',
                                title : 'Ascot :: Error' });
        } else {
          mongoLookFactory.buildFromId(req.params.look, function(error, look) {
            if (error || !look) {
              res.render('error', { error : 'Internal failure',
                                    title : 'Ascot :: Error' });
            } else {
              look.tags = req.body.tags || [];
              look.title = req.body.title || "";
              look.source = req.body.source || "";
              
              var search_tags = [];
              var title_tags = look.title.match(/[a-zA-Z0-9_]+/g);
              if (title_tags) {
                for (var i = 0; i < title_tags.length; ++i) {
                  search_tags.push(title_tags[i].toLowerCase());
                }
              }
              
              for (var i = 0; i < look.tags.length; ++i) {
                var tag = look.tags[i];
                var brand_tags = tag.product.brand.match(/[a-zA-Z0-9_]+/g);
                if (brand_tags) {
                  for (var j = 0; j < brand_tags.length; ++j) {
                    search_tags.push(brand_tags[j].toLowerCase());
                  }
                }

                var name_tags = tag.product.name.match(/[a-zA-Z0-9_]+/g);
                if (name_tags) {
                  for (var j = 0; j < name_tags.length; ++j) {
                    search_tags.push(name_tags[j].toLowerCase());
                  }
                }
              }
              look.search = search_tags;
              
              productLinkGenerator(req.user, look, function(error, look) {
                if (error || !look) {
                  res.json({ error : error });
                } else {
                  gmTagger(look, function() {
                    addLookToUser(req.user, look, function() {
                      // Return nothing. Client should handle this how it wants
                      res.json({ success : true });
                    });
                  });
                }
              });
            }
          });
        }
      });
    }
  };
};
