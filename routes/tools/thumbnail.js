/*
 *  thumbnail.js
 *
 *  Created on: May 16, 2013
 *      Author: Valeri Karpov
 *
 *  Module for generating thumbnails
 *
 */

exports.thumbnail = function(gm, temp) {
  return function(path, callback) {
    temp.open('prefix', function(error, result) {
      gm(path).size(function(error, features) {
        if (error || !features) {
          callback({ error : error }, null);
        } else {
          gm(path).resize(226, features.height * (226 / features.width)).write(result.path, function(error) {
            if (error) {
              callback({ error : error }, null);
            } else {
              callback(null, result.path);
            }
          });
        }
      });
    });
  };
};