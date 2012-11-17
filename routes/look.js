
/*
 * GET Image
 */

var MongoLookFactory = require('../factories/MongoLookFactory.js').MongoLookFactory;

exports.get = function(req, res){

  // retrieve database
  var look = new MongoLookFactory()

  look.buildFromId(id, function(err, result){
    if (error || !result) {
      console.log("Error " + JSON.stringify(error) + "---");
      callback(error, null);
    } else {
      
      res.render('look', { look: result });
      
    }
  };



};
