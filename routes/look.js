
/*
 * GET Image
 */

var MongoLookFactory = require('../factories/MongoLookFactory.js').MongoLookFactory;
var fs = require('fs');

var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'ascot');

var LookSchema = require('../models/Look.js').LookSchema;
var Look = db.model('looks', LookSchema);

var ProductSchema = require('../models/Product.js').ProductSchema;
var Product = db.model('products', ProductSchema);

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
        // render layout
        console.log(JSON.stringify(result));
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
      // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
      if (error) {
        callback(error, null, null);
        return;
      }
      fs.unlink(tmpPath, function(error) {
        // Don't care about error, probably means files already gone
        callback(null, look, permissions);
      });
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
      console.log("Upload? " + req.files.files.length);
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
          res.redirect('/tagger/' + permissions._id + '/' + look._id);
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
  Look.findOne({ random : { $near : [rand, 0] } }, function(error, look) {
    if (error || !look) {
      res.render('error', { error : 'Could not find a random look?', title : 'Ascot :: Error' });
    } else {
      res.redirect('/look/' + look._id);
    }
  });
};

/*
 * GET /brand?v=<brand>
 */
exports.brand = function(req, res) {
  var stream = Look.find().populate('tags.product').stream();
  var ret = [];
  stream.on('data', function(look) {
    for (var i = 0; i < look.tags.length; ++i) {
      console.log(JSON.stringify(look));
      if (look.tags[i].product &&
          look.tags[i].product.brand.toLowerCase() == req.query["v"].toLowerCase()) {
        ret.push(look);
      }
    }
  });
  stream.on('close', function() {
    res.render('looks_list', { looks : ret, title : 'Ascot :: ' + req.query["v"] });
  });
  stream.resume();
};

/*
 * GET /type?v=<type>
 */
exports.type = function(req, res) {
  var stream = Look.find().populate('tags.product').stream();
  var ret = [];
  stream.on('data', function(look) {
    for (var i = 0; i < look.tags.length; ++i) {
      if (look.tags[i].product &&
          look.tags[i].product.type.toLowerCase() == req.query["v"].toLowerCase()) {
        ret.push(look);
      }
    }
  });
  stream.on('close', function() {
    res.render('looks_list', { looks : ret, title : 'Ascot :: ' + req.query["v"] });
  });
  stream.resume();
};

/*
 * GET /all
 */
exports.all = function(req, res) {
  Look.find({}, function(error, looks) {
    if (error || !looks) {
      res.render('error',
          { title : "Ascot :: Error", error : "Couldn't load looks'" });
    } else {
      res.render('looks_list', { looks : looks, title : 'Ascot :: All Looks'});
    }
  });
}
