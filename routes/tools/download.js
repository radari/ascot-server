/**
 *  download.js
 *
 *  Created on: April 12, 2013
 *      Author: Valeri Karpov
 *
 *  Interface for downloading a URL to a temp file - mashup of http-get
 *  and temp for convenience.
 *
 */

exports.download = function(httpGet, temp) {
  return function(url, callback) {
    temp.open('prefix', function(error, info) {
      console.log("!@ " + info.path);
      if (error || !info) {
        callback("error - " + error, null);
      } else {
        console.log("--> " + info.path);
        httpGet.get(url, info.path, function(error, result) {
          if (error || !result) {
            callback("error - " + error, null);
          } else {
            callback(null, info.path);
          }
        });
      }
    });
  };
};