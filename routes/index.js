
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

/*
 * GET /howto/wordpress
 */
exports.wordpress = function(req, res) {
  res.render('wordpress', { title : 'Ascot :: Wordpress Help' });
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

exports.websites = function(req, res) {
  res.render('websites', { title : 'Websites' });
};

exports.planB = function(req, res) {
  res.render('planB', { title : 'planB' });
};

exports.guidelines = function(req, res) {
  res.render('guidelines', { title : 'Tagging Guidelines' });
};

exports.disclosures = function(req, res) {
  res.render('disclosures', {title: 'disclosures'});
};

exports.taggerPlugin = function(req, res) {
  res.render('help/embed_tagger', { title : 'Ascot :: About Tagger Plugin' });
};

exports.progress = function(req, res) {
  res.render('progress', { title : 'Ascot :: About Tagger Plugin' });
};