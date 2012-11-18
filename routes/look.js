
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

exports.upload = function(req, res) {
  console.log(req.body);
  console.log(req.files);

  var look = new MongoLookFactory();

  // get the temporary location of the file
  var tmp_path = req.files.thumbnail.path;
  // set where the file should actually exists - in this case it is in the "images" directory
  var target_path = './public/images/uploads/' + req.files.thumbnail.name;
  // move the file from the temporary location to the intended location
  fs.rename(tmp_path, target_path, function(err) {
    // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
    fs.unlink(tmp_path, function() {
      look.newLook(req.files.thumbnail.name, target_path.replace(/\.\/public/, ""), function(){
        res.redirect('/');
      });
    });
  });
};
