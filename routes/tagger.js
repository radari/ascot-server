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
 
/*
 * GET /tagger/:look
 */
exports.get = function(displayRoute, validator, mongoLookFactory) {
  return function(req, res) {
    if (req.params.look) {
      validator.canEditTags(req.user, req.cookies.permissions || [], req.params.look, function(error, permission) {
        if (error || !permission) {
          res.render('error', { error : 'Access Denied', title : 'Error' });
        } else {
          mongoLookFactory.buildFromId(req.params.look, function(error, look) {
            if (error || !look) {
              res.render('error', { error : 'Internal failure', title : 'Error' });
            } else {
              res.render(displayRoute, { title: "Ascot :: Image Tagger", look : look });
            }
          });
        }
      });
    }
  };
};

/*
 * PUT /tagger/:look
 */
exports.put = function(validator, mongoLookFactory, shopsense, gmTagger, shortener) {
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
              
              if ((req.user && req.user.settings.affiliates.shopsense.enabled)
                  || !req.user) {
                var shopsenseLinkCount = 0;
                var shopsenseKey =
                    req.user ?
                        req.user.settings.affiliates.shopsense.key :
                        'uid4336-13314844-31';
                var shopsenseLinkify = function(index) {
                  console.log('Checking tag ' + index);
                  
                  shopsense(shopsenseKey,
                            look.tags[index].product.buyLink,
                            function(error, url) {
                              if (!error && url) {
                                look.tags[index].product.buyLink = url;
                              }
                              
                              shortener.shorten(look.tags[index].product.buyLink, function(error, response) {
                                look.tags[index].product.buyLinkMinified = response;
                                ++shopsenseLinkCount;

                                if (shopsenseLinkCount >= look.tags.length) {
                                  look.save(function(error, savedLook) {
                                    if (error || !savedLook) {
                                      console.log(error);
                                      res.render('error',
                                          { error : 'Failed to save tags',
                                            title : 'Ascot :: Error' });
                                    } else {
                                      gmTagger(look, function() {
                                        // Return nothing, client should handle this
                                        // how it wants
                                        res.json({});
                                      });
                                    }
                                  });
                                  return;
                                }
                              });
                  });
                  
                  if (index + 1 < look.tags.length) {
                    shopsenseLinkify(index + 1);
                  }
                };
                
                if (look.tags.length > 0) {
                  shopsenseLinkify(0);
                }
              }
            }
          });
        }
      });
    }
  };
};
