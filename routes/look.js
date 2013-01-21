
var MongoLookFactory = require('../factories/MongoLookFactory.js').MongoLookFactory;
var fs = require('fs');

var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'ascot');

var LookSchema = require('../models/Look.js').LookSchema;
var Look = db.model('looks', LookSchema);

var ImageMagick = require('imagemagick');

/*
 * GET /look/:id
 */

exports.get = function(url) {
  var look = new MongoLookFactory(url);
  return function(req, res) {
    // retrieve database
    look.buildFromId(req.params.id, function(error, result){
      if (error) {
        res.render('error', { error : 'Failed to find image', title : 'Error' });
      } else if (!result) {
        res.render('error', { error : 'Image not found', title : 'Error' });
      } else {
        // render layout
        console.log(JSON.stringify(result));
        res.render('look', { title: 'Ascot :: ' + result.title, look: result });
      }
    });
  }
};

/*
 * GET /look/:id/iframe
 */
exports.iframe = function(url) {
  var mongoLookFactory = new MongoLookFactory(url);
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

var handleUpload = function(handle, mongoLookFactory, callback) {
  var tmpPath = handle.path;
  // set where the file should actually exists - in this case it is in the "images" directory
  mongoLookFactory.newLook(function(error, look, permissions) {
    if (error) {
      console.log(error);
    }
    var targetPath = './public/images/uploads/' + look._id + '.png';
    // move the file from the temporary location to the intended location
    fs.rename(tmpPath, targetPath, function(error) {
      if (error) {
        callback(error, null, null);
      } else {
        ImageMagick.identify(targetPath, function(error, features) {
          mongoLookFactory.setHeightAndWidth(look._id, features.height, features.width, function(error, look) {
            fs.unlink(tmpPath, function(error) {
              // Don't care about error, probably means files already gone
              callback(null, look, permissions);
            });
          });
        });
      }
    });
  });
};

/*
 * POST /image-upload
 */
exports.upload = function(url) {
  var mongoLookFactory = new MongoLookFactory(url);
  return function(req, res) {
    if (req.files && req.files.files && req.files.files.length > 0) {
      console.log("Upload? " + JSON.stringify(req.files.files));
      var ret = [];
      handleUpload(req.files.files, mongoLookFactory, function(error, look, permissions) {
        if (error) {
          res.render('error', { title : "Ascot :: Error", error : "Upload failed" });
          console.log(JSON.stringify(error));
        } else {
          res.redirect('/tagger/' + permissions._id + '/' + look._id);
        }
      });
    } else if (req.body.url) {
      console.log("From url " + req.body.url);
      mongoLookFactory.newLookWithUrl(req.body.url, function(error, look, permissions) {
        if (error) {
          res.render('error', { title : "Ascot :: Error", error : "Upload failed" });
        } else {
          ImageMagick.identify(look.url, function(error, features) {
            mongoLookFactory.setHeightAndWidth(look._id, features.height, features.width, function(error, look) {
              res.redirect('/tagger/' + permissions._id + '/' + look._id);
            });
          });
        }
      });
    }
  };
};

/*
 * GET /random
 */
exports.random = function(req, res) {
  rand = Math.random();
  Look.findOne({ random : { $near : [rand, 0] }, showOnCrossList : 1 }, function(error, look) {
    if (error || !look) {
      res.render('error', { error : 'Could not find a random look?', title : 'Ascot :: Error' });
    } else {
      res.redirect('/look/' + look._id);
    }
  });
};

/*
 * GET /filters.json?query=<query>
 */
exports.filters = function(req, res) {
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
        for (var i = 0; i < brands.length; ++i) {
          ret["data"].push({ v : brands[i], type : 'Brand' });
          ret["suggestions"].push(brands[i] + ' (Brand)');
        }
        res.json(ret);
      });
};

/*
 * GET /brand?v=<brand>
 */
exports.brand = function(req, res) {
  var MAX_PER_PAGE = 20;
  var p = req.query["p"] || 0;

  Look.find({ 'tags.product.brand' : req.query["v"], showOnCrossList : 1 }).count(function(error, count) {
    Look.find({ 'tags.product.brand' : req.query["v"], showOnCrossList : 1 }, function(error, looks) {
      res.render('looks_list',
          { looks : looks,
            listTitle : 'Looks for ' + req.query["v"] + ' (Brand)',
            title : 'Ascot :: ' + req.query["v"],
            routeUrl : '/brand?v=' + encodeURIComponent(req.query["v"]) + '&',
            page : p,
            numPages : Math.ceil((count + 0.0) / (MAX_PER_PAGE + 0.0)) });
    });
  });
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
    Look.find({ search : { $all : keywords }, showOnCrossList : 1 }, function(error, looks) {
      if (error || !looks) {
        res.render('error', { error : 'Error ' + JSON.stringify(error), title : 'Ascot :: Error' });
      } else {
        res.render('looks_list',
            { looks : looks,
              listTitle : 'Looks with Keywords : ' + req.query["v"],
              title : 'Ascot :: ' + req.query["v"],
              routeUrl : '/keywords?v=' + encodeURIComponent(req.query["v"]) + '&',
              page : p,
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
    Look.find({}).limit(MAX_PER_PAGE).skip(p * MAX_PER_PAGE).exec(function(error, looks) {
    console.log("---> " + looks.length);
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
            numPages : Math.ceil((count + 0.0) / (MAX_PER_PAGE + 0.0))});
    }
  });
  });
}
