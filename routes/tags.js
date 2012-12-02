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
 * GET tags.jsonp?url=<url>
 */

exports.get = function(url) {
  var mongoLookFactory = new MongoLookFactory(url);
  return function(req, res) {
    mongoLookFactory.buildFromId(req.query["id"], function(error, look) {
      if (error) {
        res.render('error', { error : "Image not found", title : "Error" });
        console.log(JSON.stringify(error));
      } else if (!look) {
        res.jsonp({});
      } else {
        res.jsonp(look);
      }
    });
  };
};
