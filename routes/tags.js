var MongoLookFactory = require('../factories/MongoLookFactory.js').MongoLookFactory;

/*
 * GET tags.jsonp?url=<url>
 */

exports.get = function(req, res) {
  var mongoLookFactory = new MongoLookFactory();
  mongoLookFactory.buildFromUrl(req.query["url"], function(error, look) {
    if (error || !look) {
      // TODO: error page
      res.render('index', { title : "Errror!" });
      console.log(JSON.stringify(error));
    } else {
      res.jsonp(JSON.stringify(look));
    }
  });
};
