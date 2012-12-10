var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'ascot');

var LookSchema = require('../models/Look.js').LookSchema;
var Look = db.model('looks', LookSchema);

var randomTo2D = function(look) {
  look.random = [Math.random(), 0];
};

Look.find({}, function(error, looks) {
  for (var i = 0; i < looks.length; ++i) {
    console.log(JSON.stringify(looks[i]));
    randomTo2D(looks[i]);
    looks[i].save();
  }
  console.log("DONE");
});
