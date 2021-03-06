/**
 *  product_link_generator.js
 *
 *  Created on: April 27, 2013
 *      Author: Valeri Karpov
 *
 *  Generates all the links we need for a given look
 *
 */

exports.ProductLinkGenerator = function(shortener, readify, shopsense, linkshare) {
  return function(user, look, callback) {
    var doneTagsCount = 0;

    var checkLinkshare = function(index, done) {
      if (!look.tags[index].product.buyLink || look.tags[index].product.hasAffiliateLink) {
        done();
      } else if (!user || (user && user.settings.affiliates.linkshare.enabled)) {
        var linkshareKey = user ?
            user.settings.affiliates.linkshare.key :
            'b59b94c0621af2ba72ddc0b24e16dfa805c0b8056df90e2de5622c6713698ba6';

        linkshare(linkshareKey, look.tags[index].product.buyLink, function(error, url) {
          if (!error && url) {
            look.tags[index].product.buyLink = url;
            look.tags[index].product.hasAffiliateLink = true;
          }
          done();
        });
      } else {
        done();
      }
    };

    var checkShopsense = function(index, done) {
      if (!look.tags[index].product.buyLink) {
        done();
      } else if (!user || (user && user.settings.affiliates.shopsense.enabled)) {
        var shopsenseKey = user ?
            user.settings.affiliates.shopsense.key :
            'uid4336-13314844-31';

        shopsense(shopsenseKey, look.tags[index].product.buyLink, function(error, url) {
          if (!error && url) {
            look.tags[index].product.buyLink = url;
            look.tags[index].product.hasAffiliateLink = true;
          }
          done();
        });
      } else {
        done();
      }
    }

    var linkify = function(index) {
      checkShopsense(index, function() {
        checkLinkshare(index, function() {
          shortener.shorten(look.tags[index].product.buyLink, function(error, response) {
            look.tags[index].product.buyLinkMinified = response;
            readify.readify(look.tags[index].product, look.tags[index].product.buyLink, function(error, readableUrl) {
              look.tags[index].product.buyLinkReadable = readableUrl;
              ++doneTagsCount;

              if (doneTagsCount >= look.tags.length) {
                look.save(function(error, look) {
                  if (error || !look) {
                    callback("error - " + error, null);
                  } else {
                    callback(null, look);
                  }
                });
              }
            });
          });
        });
      });

      if (index + 1 < look.tags.length) {
        linkify(index + 1);
      }
    };

    if (look.tags.length > 0) {
      linkify(0);
    } else {
      callback(null, look);
    }
  };
};