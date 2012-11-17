
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , tags = require('./routes/tags.js')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({uploadDir:'./public/images'}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/tags.jsonp', tags.get)

app.post('/image-upload', function(req, res, next) {
    console.log(req.body);
    console.log(req.files);
    res.render([
    {
      "name":"picture1.jpg",
      "size":902604,
      "url":"\/\/example.org\/files\/picture1.jpg",
      "thumbnail_url":"\/\/example.org\/thumbnails\/picture1.jpg",
      "delete_url":"\/\/example.org\/upload-handler?file=picture1.jpg",
      "delete_type":"DELETE"
    },
    {
      "name":"picture2.jpg",
      "size":841946,
      "url":"\/\/example.org\/files\/picture2.jpg",
      "thumbnail_url":"\/\/example.org\/thumbnails\/picture2.jpg",
      "delete_url":"\/\/example.org\/upload-handler?file=picture2.jpg",
      "delete_type":"DELETE"
    }]);
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
