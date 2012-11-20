
/*
 * GET Image
 */

var MongoLookFactory = require('../factories/MongoLookFactory.js').MongoLookFactory;
var fs = require('fs');

var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'ascot');

var LookSchema = require('../models/Look.js').LookSchema;
var Look = db.model('looks', LookSchema);

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
        res.render('look', { title: 'Ascot', look: result });
      }
    });
  }
};

exports.iframe = function(url) {
  var mongoLookFactory = new MongoLookFactory(url);
  return function(req, res) {
    mongoLookFactory.buildFromId(req.params.id, function(error, result) {
      if (error) {
        res.render('error', { error : 'Failed to find image', title : 'Error' });
      } else if (!result) {
        res.render('error', { error : 'Image not found', title : 'Error' });
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
  mongoLookFactory.newLook(handle.name, function(error, look, permissions) {
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

exports.upload = function(url) {
  var mongoLookFactory = new MongoLookFactory(url);
  return function(req, res) {
    if (req.files && req.files.files && req.files.files.length > 0) {
      console.log("Upload? " + req.files.files.length);
      var ret = [];
      handleUpload(req.files.files, mongoLookFactory, function(error, look, permissions) {
        if (error) {
          res.render('error', { title : "Error", error : "Upload failed" });
          console.log(JSON.stringify(error));
        } else {
          res.redirect('/tagger/' + permissions._id + '/' + look._id);
        }
      });
    } else if (req.body.url) {
      console.log("From url " + req.body.url);
      mongoLookFactory.buildFromUrl(req.body.url, function(error, look) {
        if (null == look) {
          mongoLookFactory.newLookWithUrl('Untitled Look', req.body.url, function(error, look, permissions) {
            if (error) {
              res.render('error', { title : "Error", error : "Upload failed" });
            } else {
              res.redirect('/tagger/' + permissions._id + '/' + look._id);
            }
          });
        } else {
          res.render('error', { title : "Error", error : "This image has already been uploaded" });
        }
      });
    }
  };
};

exports.random = function(req, res) {
  rand = Math.random();
  Look.findOne({ random : { $gte : rand } }, function(error, look) {
    if (error || !look) {
      Look.findOne({ random : { $lte : rand } }, function(error, look) {
        if (error || !look) {
          res.render('error', { error : 'Could not find a random look?', title : 'Error' });
        } else {
          res.redirect('/look/' + look._id);
        }
      });
    } else {
      res.redirect('/look/' + look._id);
    }
  });
};
