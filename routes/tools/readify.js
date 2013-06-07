/**
 *  readify.js
 *
 *  Created on: April 24, 2013
 *      Author: Valeri Karpov
 *
 *  Create readable links for our product links because Apple is a steaming
 *  pile of buffalo feces. Basically creates a product link like
 *  http://www.ascotproject.com/p/Nike-Air-Zoom-3/1
 *
 */

exports.readify = function(Readable, myUrl) {
  return {
    readify : function(product, url, callback) {
      if (!url || url.length == 0) {
        return callback(null, url);
      }

      var s = product.brand.trim() + ' ' + product.name.trim();
      var sp = s.split(/\s+/);
      var ret = "";
      for (var i = 0; i < sp.length; ++i) {
        sp[i] = encodeURIComponent(sp[i]);
        sp[i] = sp[i].replace(/%[0-9A-F][0-9A-F]/gi, '');

        ret += (i > 0 ? '-' : '') +
            sp[i].charAt(0).toUpperCase() + sp[i].substr(1).toLowerCase();
      }



      Readable.find({ readable : ret }, function(error, readables) {
        var r = new Readable({ readable : ret, number : readables.length + 1, url : url });
        r.save(function(error, r) {
          if (error || !r) {
            callback("error - " + error, null);
          } else {
            callback(null, myUrl + '/p/' + r.readable + '/' + r.number);
          }
        });
      });
    },
    longify : function(readable, number, callback) {
      Readable.findOne({ readable : readable, number : number }, function(error, readable) {
        if (error || !readable) {
          callback("error - " + error, null);
        } else {
          callback(null, readable.url);
        }
      });
    }
  }
};