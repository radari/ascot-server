var httpGet = require('http-get')
  , path = require('path')
  , fs = require('fs')
  , temp = require('temp')
  , knox = require('knox')
  , gm = require('gm');

var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'ascot', 27017, { user : 'ascot', pass : 'letMeGiveYouAHug' });

var LookSchema = require('../../models/Look.js').LookSchema;
var Look = db.model('looks', LookSchema);

var uploadTarget = knox.createClient({
  key : "AKIAJW2LJ5AG2WHBDYIA",
  secret : "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",
  bucket : 'ascot_uploads'
});

var uploadHandler = function(uploadTarget, mode) {
  return function(imagePath, remoteName, callback) {
    uploadTarget.putFile(imagePath, (mode == 'test' ? '/test/' : '/uploads/') + remoteName, { 'x-amz-acl': 'public-read' }, function(error, result) {
      if (error || !result) {
        callback("error - " + error, null);
      } else {
        callback(null, 'https://s3.amazonaws.com/ascot_uploads' + (mode == 'test' ? '/test/' : '/uploads/') + remoteName);
      }
    });
  };
}(uploadTarget, 'production');

var gmTagger = require('../../routes/tools/gm_tagger.js').gmTagger(gm, temp, fs, httpGet, uploadHandler);

Array.prototype.ascotRemove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

Look.find({}, function(error, looks) {
  console.log("--> " + looks.length);
  for (var i = 0; i < looks.length; ++i) {
    console.log(i + "/" + looks.length);
    console.log(JSON.stringify(looks[i]));
    if (!looks[i].taggedUrl) {
      console.log("Creating tags!");
      gmTagger(looks[i], function(error, result) {
        console.log(error + " " + result);
      });
    }
  }
});


