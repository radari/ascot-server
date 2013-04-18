/**
 *  shortener.js
 *
 *  Created on: April 18, 2013
 *      Author: Valeri Karpov
 *
 *  Shorten our URLs
 *
 */

exports.shortener = function(Shortened, myUrl) {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';

  return {
    shorten : function(url, callback) {
      var key = '';
      var fn = function() {
        key = '';
        for (var i = 0; i < 5; ++i) {
          key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        Shortened.findOne({ key : key }, function(error, shortened) {
          if (error || !shortened) {
            var s = new Shortened({ key : key, url : url });
            s.save(function(error, s) {
              if (error || !s) {
                callback("error - " + error, null);
              } else {
                callback(null, myUrl + '/l/' + s.key);
              }
            });
          } else {
            fn();
          }
        })
      };

      fn();
    }
  };
};