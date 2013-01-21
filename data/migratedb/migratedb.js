var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'ascot');

var LookSchema = require('../../models/Look.js').LookSchema;
var Look = db.model('looks', LookSchema);

var ImageMagick = require('imagemagick');

Array.prototype.ascotRemove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var randomTo2D = function(look) {
  look.random = [Math.random(), 0];
};

var fixShopstyleUrls = function(product) {
  if (product.buyLink.indexOf('http://api.shopstyle.com/action/apiVisitRetailer?id=') == 0) {
    var index = product.buyLink.indexOf('pid');
    product.buyLink = product.buyLink.substring(0, index) + '&' + product.buyLink.substring(index);
    return true;
  }
  return false;
};

var addShowOnCrossList = function(look) {
  look.showOnCrossList = look.showOnCrossList || 1;
};

var mergeTag = function(productsCollection, looksCollection, look, tagIndex) {
  console.log("- " + JSON.stringify(look));
  if (!look.tags) {
    return;
  }
  if (look.tags[tagIndex] && look.tags[tagIndex].product && look.tags[tagIndex].product != null) {
    if (look.tags[tagIndex].product.brand == undefined) {
      var product = look.tags[tagIndex].product;
      productsCollection.findOne( { _id : product }, function(error, p) {
        look.tags[tagIndex].product = p;
        delete look.tags[tagIndex]._id;
        if (tagIndex + 1 < look.tags.length) {
          mergeTag(productsCollection, looksCollection, look, tagIndex + 1);
        } else {
          looksCollection.update({ _id : look._id }, look, function(error, l) {
            console.log("Updated look " + JSON.stringify(l));
          });
        }
      });
    }
  } else {
    // Delete undefined tags
    look.tags.ascotRemove(tagIndex);
    if (tagIndex < look.tags.length) {
      console.log("Removed undefined, moving on to next");
      mergeTag(productsCollection, looksCollection, look, tagIndex);
    } else {
      looksCollection.update({ _id : look._id }, look, function(error, l) {
        console.log("Deleted tag, no more left to merge " + JSON.stringify(l));
      });
    }
  }
};

var mergeProductsForLook = function(productsCollection, looksCollection, looks, index) {
  mergeTag(productsCollection, looksCollection, looks[index], 0);
  if (index + 1 < looks.length) {
    mergeProductsForLook(productsCollection, looksCollection, looks, index + 1);
  }
};

var mergeProductsIntoLooks = function() {
  var Db = require('mongodb').Db;
  var Connection = require('mongodb').Connection;
  var Server = require('mongodb').Server;
  var BSON = require('mongodb').BSON;
  var ObjectID = require('mongodb').ObjectID;

  var d = new Db('ascot',  new Server('localhost', 27017, {auto_reconnect: true}, {}));
  d.open(function() {
    d.collection('looks', function(error, looksCollection) {
      d.collection('products', function(error, productsCollection) {
        looksCollection.find().toArray(function(error, looks) {
          mergeProductsForLook(productsCollection, looksCollection, looks, 0);
        });
      });
    });
  });
};

var checkForBadTags = function(look) {
  console.log("# of TAGS = " + look.tags.length);
  if (look.tags.length == 0) {
    return false;
  }

  for (var i = 0; i < look.tags.length; ++i) {
    if (!look.tags[i].product.brand) {
      return false;
    }
  }
  return true;
};

var addHeightAndWidthForLook = function(look, callback) {
  if (!look.size || !look.size.height || !look.size.width || look.size.height == 0 || look.size.width == 0) {
    ImageMagick.identify(look.url, function(error, features) {
      if (error || !features) {
        look.size.height = 0;
        look.size.width = 0;
        callback(look, false);
        console.log("ERROR FOR LOOK " + look._id + " WITH URL " + look.url);
      } else {
        look.size.height = features.height;
        look.size.width = features.width;
        callback(look, true);
      }
    });
  } else {
    callback(look, true);
  }
}

//mergeProductsIntoLooks();

Look.find({}, function(error, looks) {
  for (var i = 0; i < looks.length; ++i) {
    console.log(JSON.stringify(looks[i]));
    randomTo2D(looks[i]);
    addShowOnCrossList(looks[i]);
    if (checkForBadTags(looks[i])) {
      looks[i].save();
    } else {
      console.log("REMOVING " + looks[i]._id);
      looks[i].remove();
    }

    addHeightAndWidthForLook(looks[i], function(look, save) {
      if (save) {
        console.log("Saving " + look._id);
        look.save();
      } else {
        console.log("Avoiding removing (but probably should) " + look._id);
        //look.remove();
      }
    });
  }
});


