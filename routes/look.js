var fs = require('fs');

var gm = require('gm');

var Stopwatch = require('../public/common/Stopwatch.js').Stopwatch;
var createLookImageSizer = require('../public/common/LookImageSizer.js').createLookImageSizer;

var http = require('http-get');
var fs = require('fs');

/*
 * GET /look/:id
 */
exports.get = function(mongoLookFactory) {
  return function(req, res) {
    mongoLookFactory.buildFromId(req.params.id, function(error, result) {
      if (error) {
        res.render('error', { error : 'Failed to find image', title : 'Error' });
      } else if (!result) {
        res.render('error', { error : 'Image not found', title : 'Error' });
      } else {
        // render layout
        res.render('look', { title: 'Ascot :: ' + result.title, look: result });
      }
    });
  }
};

/*
 * GET /look/:id/iframe
 */
exports.iframe = function(mongoLookFactory) {
  return function(req, res) {
    mongoLookFactory.buildFromId(req.params.id, function(error, result) {
      if (error) {
        res.render('error', { error : 'Failed to find image', title : 'Ascot :: Error' });
      } else if (!result) {
        res.render('error', { error : 'Image not found', title : 'Ascot :: Error' });
      } else {
        res.render('look_iframe', { look: result });
      }
    });
  };
};

/*
 * GET /new/look/:user?url=<url>&title=<title>&source=<source>
 */
exports.newLookForUser = function(mongoLookFactory, mongoUserFactory, fs, gm, http) {
  return function(req, res) {
    var permissionsList = req.cookies.permissions || [];
  
    mongoUserFactory.findById(req.params.user, function(error, user) {
      if (error || !user) {
        res.render('error', { error : 'User ' + req.params.user + ' not found', title : 'Ascot :: Error' });
      } else {
        exports.handleUrl(mongoLookFactory, fs, gm, http, user, req.query.url, function(error, look, permissions) {
          if (error || !look || !permissions) {
            res.render('error', { error : error, title : 'Ascot :: Error' });
          } else {
            look.title = req.query.title || "";
            look.source = req.query.source || "";
            look.save(function(error, look) {
              // Assume success
              if (req.user) {
                // Don't double add if for some reason this is user using this
                // route for themselves
                if (req.user._id.toString() == user._id.toString()) {
                  res.redirect('/embed/tagger/' + look._id);
                } else {
                  req.user.looks.push(look);
                  req.user.save(function(error, user) {
                    res.redirect('/embed/tagger/' + look._id);
                  });
                }
              } else {
                permissionsList.push(permissions._id);
                res.cookie('permissions', permissionsList, { maxAge : 900000, httpOnly : false });
                res.redirect('/embed/tagger/' + look._id);
              }
            });
          }
        });
      }
    });
  }
};

/*
 * PUT /look/:id/published
 */
exports.updatePublishedStatus = function(mongoLookFactory) {
  return function(req, res) {
    
    if(!req.is('json')){
      console.log("Bad json");
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end();
    } else {
      mongoLookFactory.buildFromId(req.params.id, function(error, look) {
        if (error) {
          res.json({'id':req.params.id, 'error':'Could not find look' });
        } else if (!req.body.publish) {
          res.json({'id':req.params.id, 'error':'invalid parameter passed' });
        } else {

          if (req.body.publish === "1"){
            look.showOnCrossList = 1;
          } else {
            look.showOnCrossList = 0;
          }

          look.save(function(error, look) {
            if (error || !look) {
              res.json({'id':look._id, 'error': 'Failed to save look' });
            } else {
              res.json({'id':look._id, 'success': 'true', 'published': look.showOnCrossList });
            }
          });  
        }
      });
    }
  };
};

exports.handleUploadGeneric = function(user, path, mongoLookFactory, goldfinger, callback) {
  mongoLookFactory.newLook(user, function(error, look, permissions) {
    if (error) {
      console.log(error);
    }
    
    console.log("** T");
    goldfinger.toS3(path, look._id + '.png', function(error, result, features) {
      console.log("** L");
      if (error || !result || !features) {
        callback(error, null, null);
      } else {
        look.url = result;
        look.size.height = features.height;
        look.size.width = features.width;
        look.save(function(error, look) {
          callback(null, look, permissions);
        });
      }
    });
  });
};

exports.handleUpload = function(user, tmpPath, mongoLookFactory, goldfinger, callback) {
  exports.handleUploadGeneric(user, tmpPath, mongoLookFactory, goldfinger, callback);
};

exports.handleUrl = function(mongoLookFactory, goldfinger, http, user, url, callback) {
  var random = Math.random().toString(36).substr(2);
  var tmpPath = './public/images/uploads/' + random + '.png';
  http.get(url, tmpPath, function(error, result) {
    if (error) {
      callback("Image " + url + " could not be found", null);
    } else {
      exports.handleUploadGeneric(user, tmpPath, mongoLookFactory, goldfinger, callback);
    }
  });
};

/*
 * POST /image-upload
 */
exports.upload = function(mongoLookFactory, goldfinger, http, gmTagger) {
  return function(req, res) {
    var permissionsList = req.cookies.permissions || [];
  
    var checkAndTaggerRedirect = function(error, look, permissions) {
      if (error || !look || !permissions) {
        res.render('error', { title : "Ascot :: Error", error : error });
      } else {
        gmTagger(look, function(error, result) {
          permissionsList.push(permissions._id);
          res.cookie('permissions', permissionsList, { maxAge : 900000, httpOnly : false });
          res.redirect('/tagger/' + look._id);
        });
      }
    };

    if (req.files && req.files.files && req.files.files.length > 0) {
      var ret = [];
      exports.handleUpload(req.user, req.files.files.path, mongoLookFactory, goldfinger, checkAndTaggerRedirect);
    } else if (req.body.url) {
      exports.handleUrl(mongoLookFactory, goldfinger, http, req.user, req.body.url, checkAndTaggerRedirect);
    } else {
      res.render('error',
          { title : "Ascot :: Error",
            error : "No image or file selected" });
    }
  };
};

/*
 * GET /random
 */
exports.random = function(mongoLookFactory) {
  return function(req, res) {
    mongoLookFactory.getRandom(function(error, look) {
      if (error || !look) {
        res.render('error', { error : 'Could not find a random look?', title : 'Ascot :: Error' });
      } else {
        res.format({
          'html' :
              function() {
                res.redirect('/look/' + look._id);
              },
          'json' :
              function() {
                res.json(look);
              }
        });
      }
    });
  };
};

/*
 * GET /filters.json?query=<query>
 */
exports.filters = function(Look) {
  return function(req, res) {
    var ret = [];
    
    ret.push({ v : req.query["query"], type : 'Keyword' });
    
    Look.distinct('tags.product.brand').
        where('tags.product.brand').
        regex(new RegExp(req.query["query"], "i")).
        exec(function(error, brands) {
          var numAdded = 0;
          for (var i = 0; i < brands.length; ++i) {
            if (brands[i].toLowerCase().indexOf(req.query["query"].toLowerCase()) != -1) {
              ret.push({ v : brands[i], type : 'Brand' });
              if (++numAdded >= 8) {
                // Limit to 8 results
                break;
              }
            }
          }
          res.json(ret);
        });
  };
};

/**
 * Helper for list looks
 */
exports.looksList = function( Look,
                              view,
                              params,
                              title,
                              page,
                              sortBy,
                              clickthroughRoute,
                              res) {
  var MAX_PER_PAGE = 20;
  
  var sortParams = {};
  switch (sortBy) {
   case 'newest' :
    sortParams = { _id : -1 };
    break;
   case 'viewed' :
    sortParams = { numViews : -1 };
    break;
   case 'favorited' :
    sortParams = { numUpVotes : -1 };
    break;
   default :
    sortParams = { _id : -1 };
    break;
  }

  Look.find(params).count(function(error, count) {
    Look.
      find(params).
      sort(sortParams).
      limit(MAX_PER_PAGE).
      skip(page * MAX_PER_PAGE).
      exec(function(error, looks) {
        if (error || !looks) {
          res.format({
              'html' :
                  function() {
                    res.render('error',
                        { error : 'Error ' + JSON.stringify(error),
                          title : 'Ascot :: Error'
                        });
                  },
              'json' :
                  function() {
                    res.json({ error : error });
                  }
          });
        } else {
          res.format({
              'html' :
                  function() {
                    res.render(view,
                        { looks : looks,
                          listTitle : title,
                          title : 'Ascot :: ' + title,
                          page : page,
                          numPages : Math.ceil(count / MAX_PER_PAGE),
                          route : clickthroughRoute
                        });
                    },
                'json' :
                    function() {
                      res.json({ looks : looks });
                    }
              });
        }
      });
  });
};

/*
 * GET /brand?v=<brand>
 */
exports.brand = function(Look) {
  return function(req, res) {
    var p = req.query["p"] || 0;
    var sortBy = req.query["sortBy"] || "";
    
    exports.looksList(
        Look,
        'looks_list',
        { 'tags.product.brand' : req.query["v"], showOnCrossList : 1 },
        'Looks for ' + req.query["v"] + ' (Brand)',
        p,
        sortBy,
        '/look',
        res);
  };
};

/*
 * GET /keywords?v=<keywords>
 */
exports.keywords = function(Look) {
  return function(req, res) {
    var p = req.query["p"] || 0;
    var sortBy = req.query["sortBy"] || "";
    
    var keywords = req.query["v"].match(/[a-zA-Z0-9_]+/g);
    for (var i = 0; i < keywords.length; ++i) {
      keywords[i] = new RegExp('^' + keywords[i].toLowerCase(), 'i');
    }

    exports.looksList(
        Look,
        'looks_list',
        { search : { $all : keywords }, showOnCrossList : 1 },
        'Looks with Keywords : ' + req.query["v"],
        p,
        sortBy,
        '/look',
        res);
  };
};

/*
 * GET /all?p=<page>
 */
exports.all = function(Look) {
  return function(req, res) {
    var p = req.query["p"] || 0;
    var sortBy = req.query["sortBy"] || "";
    
    exports.looksList(
      Look,
      'looks_list',
      { showOnCrossList : 1 },
      'All Looks',
      p,
      sortBy,
      '/look',
      res);
  };
};

/*
 * GET /favorites
 */
exports.favorites = function(Look) {
  return function(req, res) {
    var p = req.query["p"] || 0;
    var upvotedMap = req.cookies.upvotes || {};
    var sortBy = req.query["sortBy"] || "";

    var upvotes = [];
    if (req.user) {
      upvotes = req.user.favorites;
    } else {
      for (var key in upvotedMap) {
        if (upvotedMap[key] == true) {
          upvotes.push(key);
        }
      }
    }

    exports.looksList(
        Look,
        req.user ? 'looks_list_account' : 'looks_list',
        { _id : { $in : upvotes }, showOnCrossList : 1 },
        'My Favorites',
        p,
        sortBy,
        '/look',
        res);
  };
};

/*
 * GET /home
 */
exports.myLooks = function(Look) {
  return function(req, res) {
    var p = req.query["p"] || 0;
    var upvotedMap = req.cookies.upvotes || {};
    var sortBy = req.query["sortBy"] || "";

    var looks = req.user.looks;

    exports.looksList(
        Look,
        'looks_list_account',
        { _id : { $in : looks } },
        req.user.username + '\'s Looks',
        p,
        sortBy,
        '/tagger',
        res);
  };
};

/*
 * PUT /upvote/:id.json
 */
exports.upvote = function(mongoLookFactory) {
  return function(req, res) {
    mongoLookFactory.buildFromId(req.params.id, function(error, look) {
      if (error || !look) {
        res.jsonp({ error : 'Invalid look' });
      } else {
        var upvotedMap = req.cookies ? req.cookies.upvotes || {} : {};
        if (req.user) {
          if (look._id in req.user.favorites) {
            --look.numUpVotes;
            look.save(function(error, look) {
              req.user.favorites.remove(look._id);
              req.user.save(function(error, user) {
                // Assume success
                res.jsonp({ remove : true });
              });
            });
          } else {
            ++look.numUpVotes;
            look.save(function(error, look) {
              req.user.favorites.push(look._id);
              req.user.save(function(error, user) {
                // Assume success
                res.jsonp({ add : true });
              });
            });
          }
        } else {
          if (req.params.id in upvotedMap) {
            delete upvotedMap[req.params.id];
            --look.numUpVotes;
            look.save(function(error, look) {
              res.cookie('upvotes', upvotedMap, { maxAge : 900000, httpOnly : false });
              res.jsonp({ remove : true });
            });
          } else {
            ++look.numUpVotes;
            look.save(function(error, look) {
              if (error || !look) {
                res.jsonp({ error : 'Failed to upvote look' });
              } else {
                upvotedMap[req.params.id] = true;
                res.cookie('upvotes', upvotedMap, { maxAge : 900000, httpOnly : false });
                res.jsonp({ add : true });
              }
            });
          }
        }
      }
    });
  };
};

/*
 * GET /delete/look/:id.json
 */
exports.delete = function(mongoLookFactory) {
  return function(req, res) {
    mongoLookFactory.buildFromId(req.params.id, function(error, look) {
      if (error || !look) {
        res.json({ error : error });
      } else {
        look.remove(function(error) {
          if (error) {
            res.json({ error : error });
          } else {
            res.json({ success : true });
          }
        });
      }
    });
  };
};
