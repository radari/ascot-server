
/*
 * GET /
 */

exports.index = function(req, res) {
  res.render('index', { title: 'Ascot' });
};

/*
 * GET /about
 */

exports.about = function(req, res) {
  res.render('about', {title: 'About'});
};

/*
 * GET /howto/tumblr
 */
exports.tumblr = function(req, res) {
  res.render('tumblr', { title : 'Ascot :: Tumblr Help' });
};

exports.howto = function(req, res) {
  res.render('howto', { title : 'Ascot : How To' });
};

exports.contact = function(req, res) {
  res.render('contact', { title : 'Contact' });
};

exports.privacy = function(req, res) {
  res.render('privacy', { title : 'Privacy' });
};