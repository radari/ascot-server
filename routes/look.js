
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
      console.log("Error " + JSON.stringify(error) + "---");
      callback(error, null);
    } else if (!result) {
      // TODO : invalid ID, show page not found
      res.render('index', { title : "ERROR" });
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
  mongoLookFactory.newLook(handle.name, function(error, look) {
    var targetPath = './public/images/uploads/' + look._id + '.png';
    // move the file from the temporary location to the intended location
    fs.rename(tmpPath, targetPath, function(error) {
      // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
      if (error) {
        callback(error, look);
        return;
      }
      fs.unlink(tmpPath, function(error) {
        /*if (error) {
          callback(error, look);
          return;
        }*/
        // Don't care about error, probably means files already gone
        callback(null, { name : handle.name, size : handle.size, url : look.url, thumbnail_url : look.url, delete_url : '/', delete_type : 'DELETE' });
      });
    });
  });
};

exports.upload = function(req, res) {
  if (req.files.files) {
    var mongoLookFactory = new MongoLookFactory();
    var ret = [];

    if (req.files.files[0]) {
      var loop = function(i) {
        if (req.files.files.length && i == req.files.files.length) {
          console.log("done upload " + i);
          res.json(ret);
          return;
        }
        handleUpload(req.files.files[i], mongoLookFactory, function(error, responseData) {
          if (error || !responseData) {
            res.render('index', { title : "ERROR" });
          } else {
            ret.push(responseData);
            loop(i + 1);
          }
        });
      };
      loop(0);
    } else {
      handleUpload(req.files.files, mongoLookFactory, function(error, responseData) {
        if (error) {
          res.render('index', { title : "ERROR" });
          console.log(JSON.stringify(error));
        } else {
          res.redirect('/');
        }
      });
    }
  }
};
