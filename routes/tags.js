/**
 *  tags.js
 *
 *  Created on: November 17, 2012
 *      Author: Matt Green
 *
 *  Basic routes for getting tags
 *
 */

var MongoLookFactory = require('../factories/MongoLookFactory.js').MongoLookFactory;

/*
 * GET tags.jsonp?id=id
 *
 * Defaults to returning regular json if no callback is specified
 */
exports.get = function(mongoLookFactory) {
  return function(req, res) {
    var upvotedMap = req.cookies ? req.cookies.upvotes || {} : {};
    mongoLookFactory.buildFromId(req.query["id"], function(error, look) {
      if (error) {
        res.jsonp({ error : "Look failed" });
        console.log(JSON.stringify(error));
      } else if (!look) {
        res.jsonp({});
      } else {
        var hasUpvotedCookie = false;
        if (look._id in upvotedMap) {
          hasUpvotedCookie = true;
        }

        ++look.numViews;
        
        look.save(function(error, look) {
          res.jsonp({ look : look, hasUpvotedCookie : hasUpvotedCookie });
        });
      }
    });
  };
};
