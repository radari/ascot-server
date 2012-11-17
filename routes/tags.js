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

exports.get = function(req, res) {
  var mongoLookFactory = new MongoLookFactory();
  mongoLookFactory.buildFromUrl(req.query["url"], function(error, look) {
    if (error) {
      // TODO: error page
      res.render('index', { title : "Errror!" });
      console.log(JSON.stringify(error));
    } else if (!look) {
      res.jsonp({});
    } else {
      res.jsonp(look);
    }
  });
};
