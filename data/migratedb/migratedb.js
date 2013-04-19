var httpGet = require('http-get')
  , path = require('path')
  , fs = require('fs')
  //, temp = require('temp')
  , Shortener = require('../../routes/tools/shortener.js').shortener
  , Bitly = require('bitly')
  , knox = require('knox')
  , gm = require('gm');

var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'ascot', 27017, { user : 'ascot', pass : 'letMeGiveYouAHug' });

var LookSchema = require('../../models/Look.js').LookSchema;
var Look = db.model('looks', LookSchema);

var ShortendSchema = require('../../models/Shortened.js').ShortenedSchema;
var Shortened = db.model('shortend', ShortendSchema);

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

var shortener = Shortener(Shortened, 'http://ascotproject.com');

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
    //console.log(JSON.stringify(looks[i]));
    /*if (!looks[i].taggedUrl) {
      console.log("Creating tags!");
      (function(look) {
        gmTagger(look, function(error, result) {
          console.log(error + " " + result);
          console.log(look._id);
        });
      })(looks[i]);
    }*/

    var fn = function(look, index) {
      if (index == look.tags.length) {
        look.save(function(error, look) {
          console.log("Done minifying tags!");
        });
      } else {
        //if (look.tags[index].product.buyLink && !look.tags[index].product.buyLinkMinified) {
          shortener.shorten(look.tags[index].product.buyLink, function(error, response) {
            console.log(JSON.stringify(response));
            console.log("## minifying " + look.tags[index].product.buyLink + " into " + response);
            look.tags[index].product.buyLinkMinified = response;
            Sleep.sleep(1);
            fn(look, index + 1);
          });
        //} else {
        //  fn(look, index + 1);
        //}
      }
    };
    fn(looks[i], 0);
  }
});


