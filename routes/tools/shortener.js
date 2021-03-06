/**
 *  shortener.js
 *
 *  Created on: April 18, 2013
 *      Author: Valeri Karpov
 *
 *  Shorten our URLs
 *
 */

exports.shortener = function(Shortened, myUrl, random) {
  this.chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';

  return {
    shorten : function(url, callback) {
      if (!url || url.length == 0) {
        return callback(null, url);
      }
      
      var key = '';
      var fn = function() {
        key = '';
        for (var i = 0; i < 5; ++i) {
          key += chars.charAt(Math.floor(random() * chars.length));
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
    },
    longify : function(key, callback) {
      Shortened.findOne({ key : key }, function(error, shortened) {
        if (error || !shortened) {
          callback("error - " + error, null);
        } else {
          callback(null, shortened.url);
        }
      });
    }
  };
};