
/*
 * GET Image
 */

var MongoLookFactory = require('../factories/MongoLookFactory.js').MongoLookFactory;
var fs = require('fs');


exports.get = function(req, res) {
  // retrieve database
  var look = new MongoLookFactory();

  look.buildFromId(req.params.id, function(error, result){
    if (error) {
      res.render('error', { error : 'Failed to find image', title : 'Error' });
    } else if (!result) {
      res.render('error', { error : 'Image not found', title : 'Error' });
    } else {
      // render layout
      console.log(JSON.stringify(result));
      res.render('look', { title: result.title, look: result });
    }
  });
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

exports.upload = function(req, res) {
  if (req.files.files) {
    var mongoLookFactory = new MongoLookFactory();
    var ret = [];

    handleUpload(req.files.files, mongoLookFactory, function(error, look, permissions) {
      if (error) {
        res.render('index', { title : "ERROR" });
        console.log(JSON.stringify(error));
      } else {
        res.redirect('/tagger/' + permissions._id + '/' + look._id);
      }
    });
  }
};
