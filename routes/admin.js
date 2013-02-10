

var authenticate = require('./authenticate.js');

exports.index = function(req, res) {
  authenticate.ensureAuthenticated(req, res, function() {
    res.render('admin', { title : 'Ascot :: admin' });
  });
};