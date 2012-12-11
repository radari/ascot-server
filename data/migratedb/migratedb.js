var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'ascot');

var LookSchema = require('../../models/Look.js').LookSchema;
var Look = db.model('looks', LookSchema);

var ProductSchema = require('../../models/Product.js').ProductSchema;
var Product = db.model('products', ProductSchema);

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

Look.find({}, function(error, looks) {
  for (var i = 0; i < looks.length; ++i) {
    console.log(JSON.stringify(looks[i]));
    randomTo2D(looks[i]);
    looks[i].save();
  }
  Product.find({}, function(error, products) {
    for (var i = 0; i < products.length; ++i) {
      if (fixShopstyleUrls(products[i])) {
        console.log(products[i].buyLink);
      }
      products[i].save();
    }
    console.log("DONE");
  });
});


