
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

  , tags = require('./routes/tags.js')
  , look = require('./routes/look.js')
  , products = require('./routes/products.js')
  , tagger = require('./routes/tagger.js')
  , upload = require('./routes/upload.js')

  , http = require('http')
  , path = require('path')
  , fs = require('fs');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('url', process.env.ASCOTURL || 'http://localhost:' + app.get('port'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Displays
app.get('/', routes.index);
app.get('/look/:id', look.get(app.get('url')));
app.get('/tagger/:key/:look', tagger.get(app.get('url')));
app.get('/products/:id/looks', products.looks);
app.get('/upload', upload.get);
app.get('/random', look.random);

// JSON queries
app.get('/tags.jsonp', tags.get(app.get('url')));
app.get('/products.json', products.get);

// Upload
app.post('/image-upload', look.upload(app.get('url')));

// Set tags for image
app.put('/tagger/:key/:look', tagger.put(app.get('url')));

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port') + " on url " + app.get('url'));
});
