/**
 *  gm_tagger.js
 *
 *  Created on: April 9, 2013
 *      Author: Valeri Karpov
 *
 *  Use graphicsmagick to put tags in the actual image.
 *
 */

exports.gmTagger = function(gm, temp, fs, httpGet, uploadHandler) {
  return function(look, callback) {
    temp.open('myprefix', function(error, info) {
      httpGet.get(look.url, info.path, function(error) {
        var image = gm(info.path);
        var r = 12;
        console.log("--> " + look.title);
        for (var i = 0; i < look.tags.length; ++i) {
          console.log("^^ " + JSON.stringify(look.tags[i]));
          var tag = look.tags[i];
          image = image.
              fill('#6B6B6B99').
              stroke('#6B6B6B99').
              drawCircle(tag.position.x + 1, tag.position.y + 1, tag.position.x, tag.position.y + r + 3).
              fill('#00000033').
              stroke('#FFFFFF33').
              strokeWidth(3).
              drawCircle(tag.position.x, tag.position.y, tag.position.x, tag.position.y + r).
              stroke('#FFFFFF11').
              strokeWidth(1).
              font('Arial').
              fill('#FFFFFF11').
              fontSize(14).
              drawText(tag.position.x - 4, tag.position.y + 5, (i + 1) + '', 'NorthWest');
        }

        image.write(info.path, function(error) {
          if (error) {
            callback("error " + error, null);
          } else {
            uploadHandler(info.path, 'tagged_' + look._id + '.png', function(error, result) {
              fs.unlink(info.path, function(e) {
                look.taggedUrl = result || "";
                look.save(function(error, look) {
                  callback(error, look);
                });
              });
            });
          }
        });
      });
    });
  };
};