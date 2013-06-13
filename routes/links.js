/*
 * GET /l/:key
 */
exports.shortened = function(shortener) {
  return function(req, res) {
    shortener.longify(req.params.key, function(error, url) {
      if (error || !url) {
        res.render('error', { title : 'Ascot :: Error', error : "Invalid link" });
      } else {
        res.render('l', { url : url });
      }
    });
  };
};