var httpGet = require('http-get')
  , path = require('path')
  , fs = require('fs')
  //, temp = require('temp')
  , Shortener = require('../../routes/tools/shortener.js').shortener
  , Readify = require('../../routes/tools/readify.js').readify
  , Bitly = require('bitly')
  , knox = require('knox')
  , Goldfinger = require('../../routes/tools/goldfinger.js').Goldfinger
  //, Thumbnail = require('../../routes/tools/thumbnail.js').thumbnail
  , Download = require('../../routes/tools/download.js').download
  , gm = require('gm');

var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'ascot', 27017, { user : 'ascot', pass : 'letMeGiveYouAHug' });

var LookSchema = require('../../models/Look.js').LookSchema;
var Look = db.model('looks', LookSchema);

var ShortendSchema = require('../../models/Shortened.js').ShortenedSchema;
var Shortened = db.model('shortend', ShortendSchema);

var ReadableSchema = require('../../models/Readable.js').ReadableSchema;
var Readable = db.model('readable', ReadableSchema);

var Sleep = require('sleep');

var Temp = function() {
  this.counter = 0;
  this.baseDirectory = './public/images/uploads/';

  this.open = function(prefix, callback) {
    callback(null, { path : this.baseDirectory + prefix + (++this.counter) });
  };
};
var temp = new Temp();
//var bitly = new Bitly('ascotproject', 'R_3bb230d429aa1875ec863961ad1541bd');

var shortener = Shortener(Shortened, 'http://ascotproject.com', function() { return Math.random(); });
var readify = Readify(Readable, 'http://www.ascotproject.com');

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

var goldfinger = new Goldfinger(fs, gm, temp, uploadHandler);
var download = Download(httpGet, temp);
var gmTagger = require('../../routes/tools/gm_tagger.js').gmTagger(gm, temp, fs, httpGet, uploadHandler);
goldfinger.setMaxWidth(226);

Array.prototype.ascotRemove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

Look.find({}, function(error, looks) {
  console.log("--> " + looks.length);
  var f = function(i) {
    console.log(i);
    if (i >= looks.length) {
      return;
    }
    if (looks[i].thumbnail) {
      f(i + 1);
    } else {
      console.log("NO thumb " + i + " " + looks[i].url);
      download(looks[i].url, function(error, path) {
        console.log("downloaded");
        if (error || !path) {
          console.log("ERROR - " + error);
          f(i + 1);
        } else {
          goldfinger.toS3(path, 'thumb_' + looks[i]._id + '.png', function(error, result, features) {
            console.log("uploaded");
            if (error || !result || !features) {
              console.log('error - ' + error);
              f(i + 1);
            } else {
              looks[i].thumbnail = result;
              console.log("Thumbnail " + looks[i].thumbnail);
              looks[i].save();
              f(i + 1);
            }
          });
        }
      });
    }
  };
  f(0);
});


