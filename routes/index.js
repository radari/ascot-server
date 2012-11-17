
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.jsonp('index', { title: 'Express' });
};