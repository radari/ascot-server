
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

  , tags = require('./routes/tags.js')
  , look = require('./routes/look.js')
  , tagger = require('./routes/tagger.js')
  , upload = require('./routes/upload.js')

  , http = require('http')
  , path = require('path')
  , fs = require('fs');

var app = express();
var MongoLookFactory = require('./factories/MongoLookFactory.js').MongoLookFactory;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('url', process.env.ASCOTURL || 'http://localhost:' + app.get('port'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/images/twitterButton.png', {maxAge: 86400000}));
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

// Static views
app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/howto/tumblr', routes.tumblr);

var mongoLookFactory = new MongoLookFactory(app.get('url'));

// Looks and search dynamic displays
app.get('/look/:id', look.get(mongoLookFactory));
app.get('/look/:id/iframe', look.iframe(mongoLookFactory));
app.get('/tagger/:key/:look', tagger.get(mongoLookFactory));
app.get('/upload', upload.get);
app.get('/random', look.random);
app.get('/brand', look.brand);
app.get('/keywords', look.keywords);
app.get('/all', look.all);

// JSON queries
app.get('/tags.jsonp', tags.get(mongoLookFactory));
app.get('/filters.json', look.filters);

// Upload
app.post('/image-upload', look.upload(mongoLookFactory));

// Set tags for image
app.put('/tagger/:key/:look', tagger.put(mongoLookFactory));

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port') + " on url " + app.get('url'));
});
