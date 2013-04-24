/**
 *  readify.js
 *
 *  Created on: April 24, 2013
 *      Author: Valeri Karpov
 *
 *  Create readable links for our product links because Apple is a steaming
 *  pile of buffalo feces.
 *
 */

exports.readify = function() {
  return function(product, callback) {
    var s = product.brand + ' ' + product.name;
    var sp = s.split(/\s+/);
    var ret = "";
    for (var i = 0; i < sp.length; ++i) {
      ret += (i > 0 ? '-' : '') +
          sp[i].charAt(0).toUpperCase() + sp[i].substr(1).toLowerCase();
    }

    return ret;
  };
};