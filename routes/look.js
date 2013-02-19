
var MongoLookFactory = require('../factories/MongoLookFactory.js').MongoLookFactory;
var fs = require('fs');

var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'ascot');

var LookSchema = require('../models/Look.js').LookSchema;
var Look = db.model('looks', LookSchema);

var gm = require('gm');

var Stopwatch = require('../public/common/Stopwatch.js').Stopwatch;

var http = require('http-get');
var fs = require('fs');

/*
 * GET /look/:id
 */
exports.get = function(mongoLookFactory) {
  return function(req, res) {
    // retrieve database
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

exports.handleUpload = function(handle, mongoLookFactory, fs, gm, callback) {
  var tmpPath = handle.path;
  // set where the file should actually exists - in this case it is in the "images" directory
  mongoLookFactory.newLook(function(error, look, permissions) {
    if (error) {
      console.log(error);
    }
    var targetPath = './public/images/uploads/' + look._id + '.png';
    // move the file from the temporary location to the intended location
    gm(tmpPath).size(function(error, features) {
      if (features.width > 700) {
        gm(tmpPath).resize(700, features.height * (700 / features.width)).write(targetPath, function(error) {
          if (error) {
            callback(error, null, null);
          } else {
            mongoLookFactory.setHeightAndWidth(look._id, features.height * (700 / features.width), 700, function(error, look) {
              fs.unlink(tmpPath, function(error) {
                // Don't care about error, probably means files already gone
                callback(null, look, permissions);
              });
            });
          }
        });
      } else {
        fs.rename(tmpPath, targetPath, function(error) {
          if (error) {
            callback(error, null, null);
          } else {
            mongoLookFactory.setHeightAndWidth(look._id, features.height, features.width, function(error, look) {
              fs.unlink(tmpPath, function(error) {
                // Don't care about error, probably means files already gone
                callback(null, look, permissions);
              });
            });
          }
        });
      }
    });
  });
};

/*
 * POST /image-upload
 */
exports.upload = function(mongoLookFactory, fs, gm, http) {
  return function(req, res) {
    if (req.files && req.files.files && req.files.files.length > 0) {
      var ret = [];
      exports.handleUpload(req.files.files, mongoLookFactory, fs, gm, function(error, look, permissions) {
        if (error) {
          res.render('error', { title : "Ascot :: Error", error : "Upload failed" });
          console.log(JSON.stringify(error));
        } else {
          res.redirect('/tagger/' + permissions._id + '/' + look._id);
        }
      });
    } else if (req.body.url) {
      var random = Math.random().toString(36).substr(2);
      var tmpPath = './public/images/uploads/' + random + '.png';
      http.get(req.body.url, tmpPath, function(error, result) {
        if (error) {
          res.render('error',
              { title : "Ascot :: Error",
                error : "Image '" + req.body.url +
                        "' couldn't be found. Please make sure the URL is correct."
              });
        } else {
          gm(result.file).size(function(error, size) {
            if (size) {
              mongoLookFactory.newLookWithUrl(req.body.url, function(error, look, permissions) {
                if (error) {
                  res.render('error', { title : "Ascot :: Error", error : "Upload failed" });
                } else {
                  // Keep the image for tumblr uploading
                  fs.rename(tmpPath, './public/images/uploads/' + look._id + '.png', function(error) {
                    mongoLookFactory.setHeightAndWidth(look._id, size.height, size.width, function(error, look) {
                      if (error || !look) {
                        res.render('error', { title : "Ascot :: Error", error : "Internal failure" });
                      } else {
                        res.redirect('/tagger/' + permissions._id + '/' + look._id);
                      }
                    });
                  });
                }
              });
            } else {
              res.render('error',
                  { title : "Ascot :: Error",
                    error : "Image '" + error +
                            "' couldn't be found. Please make sure the URL is correct."
                  });
            }
          });
        }
      });
      
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
        res.redirect('/look/' + look._id);
      }
    });
  };
};

/*
 * GET /filters.json?query=<query>
 */
exports.filters = function(Look) {
  return function(req, res) {
    var ret = {};
    ret["query"] = req.query["query"];
    ret["suggestions"] = [];
    ret["data"] = [];
    
    ret["suggestions"].push('Search for: ' + ret["query"]);
    ret["data"].push({ v : ret["query"], type : 'Keyword' });
    
    Look.distinct('tags.product.brand').
        where('tags.product.brand').
        regex(new RegExp(req.query["query"], "i")).
        exec(function(error, brands) {
          var numAdded = 0;
          for (var i = 0; i < brands.length; ++i) {
            if (brands[i].toLowerCase().indexOf(req.query["query"].toLowerCase()) != -1) {
              ret["data"].push({ v : brands[i], type : 'Brand' });
              ret["suggestions"].push(brands[i] + ' (Brand)');
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

exports.generateLookImageSize = function(looks, numPerRow, maxWidth) {
  var totalRowWidth = [];
  var totalRowHeight = [];
  var totalAspect = [];
  var numInRow = [];
  for (var i = 0; i < looks.length; i += numPerRow) {
    totalRowWidth.push(0);
    totalRowHeight.push(0);
    totalAspect.push(0);
    numInRow.push(0);
    var row = i / numPerRow;
    for (var j = 0; j < numPerRow && i + j < looks.length; ++j) {
      totalRowWidth[row] += looks[i + j].size.width;
      totalRowHeight[row] += looks[i + j].size.height;
      // Total width of the row if all images have size 1
      totalAspect[row] += (looks[i + j].size.width / looks[i + j].size.height);
      numInRow[row] += 1;
    }
  }

  return {
    getWidth : function(index) {
      return Math.floor((this.getHeight(index) / looks[index].size.height) * looks[index].size.width);
    },
    getHeight : function(index) {
      var row = Math.floor(index / numPerRow);
      return Math.min(Math.floor(maxWidth / totalAspect[row]), 250);
    }
  };
};

/*
 * GET /brand?v=<brand>
 */
exports.brand = function(Look) {
  var MAX_PER_PAGE = 20;
  
  return function(req, res) {
    var p = req.query["p"] || 0;

    Look.find({ 'tags.product.brand' : req.query["v"], showOnCrossList : 1 }).count(function(error, count) {
      Look.
          find({ 'tags.product.brand' : req.query["v"], showOnCrossList : 1 }).
          sort({ _id : -1 }).
          limit(MAX_PER_PAGE).skip(p * MAX_PER_PAGE).
          exec(function(error, looks) {
            res.render('looks_list',
              { looks : looks,
                listTitle : 'Looks for ' + req.query["v"] + ' (Brand)',
                title : 'Ascot :: ' + req.query["v"],
                routeUrl : '/brand?v=' + encodeURIComponent(req.query["v"]) + '&',
                page : p,
                sizer : exports.generateLookImageSize(looks, 5, 780),
                numPages : Math.ceil((count + 0.0) / (MAX_PER_PAGE + 0.0)) });
          });
    });
  };
};

/*
 * GET /keywords?v=<keywords>
 */
exports.keywords = function(req, res) {
  var MAX_PER_PAGE = 20;
  var p = req.query["p"] || 0;
  
  var keywords = req.query["v"].match(/[a-zA-Z0-9_]+/g);
  for (var i = 0; i < keywords.length; ++i) {
    keywords[i] = new RegExp('^' + keywords[i].toLowerCase(), 'i');
  }
  
  Look.find({ search : { $all : keywords }, showOnCrossList : 1 }).count(function(error, count) {
    Look.
        find({ search : { $all : keywords }, showOnCrossList : 1 }).
        sort({ _id : -1 }).
        limit(MAX_PER_PAGE).skip(p * MAX_PER_PAGE).
        exec(function(error, looks) {
          if (error || !looks) {
            res.render('error', { error : 'Error ' + JSON.stringify(error), title : 'Ascot :: Error' });
          } else {
            res.render('looks_list',
                { looks : looks,
                  listTitle : 'Looks with Keywords : ' + req.query["v"],
                  title : 'Ascot :: ' + req.query["v"],
                  routeUrl : '/keywords?v=' + encodeURIComponent(req.query["v"]) + '&',
                  page : p,
                  sizer : exports.generateLookImageSize(looks, 5, 780),
                  numPages : Math.ceil((count + 0.0) / (MAX_PER_PAGE + 0.0)) });
          }
        });
  });
}

/*
 * GET /all?p=<page>
 */
exports.all = function(req, res) {
  var MAX_PER_PAGE = 20;
  var p = req.query["p"] || 0;
  
  Look.find({}).count(function(error, count) {
    Look.
        find({}).
        sort({ _id : -1 }).
        limit(MAX_PER_PAGE).skip(p * MAX_PER_PAGE).
        exec(function(error, looks) {
          if (error || !looks) {
            res.render('error',
                { title : "Ascot :: Error", error : "Couldn't load looks'" });
          } else {
            res.render('looks_list',
                { looks : looks,
                  listTitle : 'All Looks',
                  title : 'Ascot :: All Looks',
                  routeUrl : '/all?',
                  page : p,
                  sizer : exports.generateLookImageSize(looks, 5, 780),
                  numPages : Math.ceil((count + 0.0) / (MAX_PER_PAGE + 0.0))});
          }
        });
  });
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
        if (req.params.id in upvotedMap) {
          res.jsonp({ error : 'Already upvoted' });
        } else {
          ++look.numUpVotes;
          look.save(function(error, look) {
            if (error || !look) {
              res.jsonp({ error : 'Failed to upvote look' });
            } else {
              upvotedMap[req.params.id] = true;
              res.cookie('upvotes', upvotedMap, { maxAge : 900000, httpOnly : false });
              res.jsonp({});
            }
          });
        }
      }
    });
  };
};
