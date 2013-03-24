/**
 *  affiliates.js
 *
 *  Created on: March 21, 2013
 *      Author: Valeri Karpov
 *
 *  Turn URLs into affiliate urls
 *
 */

exports.shopsense = function(httpGet) {
  return function(key, url, callback) {
    var shopsenseQuery =
        'https://shopsense.shopstyle.com/action/buildDeeplinkURL?url=' +
        encodeURIComponent(url) +
        '&ssAjax=1';
    if (url.length == 0) {
      callback({ error : 'This retailer is not on Shopsense' }, null);
      return;
    }
    
    httpGet.get(shopsenseQuery, function(error, result) {
      var response = JSON.parse(result.buffer);
      console.log(JSON.stringify(response));
      if (response.url) {
        response.url +=
            "&pid=" + key + "&utm_medium=widget&utm_source=Product+Link";
        callback(null, response.url);
      } else {
        callback({ error : 'This retailer is not on Shopsense' }, null);
      }
    });
  };
};
