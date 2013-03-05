
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

  , tags = require('./routes/tags.js')
  , look = require('./routes/look.js')
  , tagger = require('./routes/tagger.js')
  , upload = require('./routes/upload.js')
  , product = require('./routes/product.js')
  , authenticate = require('./routes/authenticate.js')
  , admin = require('./routes/admin.js')

  , http = require('http')
  , httpGet = require('http-get')
  , path = require('path')
  , fs = require('fs')
  , gm = require('gm')
  
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


var app = express();
var MongoLookFactory = require('./factories/MongoLookFactory.js').MongoLookFactory;

var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'ascot');

var LookSchema = require('./models/Look.js').LookSchema;
var Look = db.model('looks', LookSchema);

// configure passport for user auth
passport.use(new LocalStrategy(authenticate.localStrategy));
passport.serializeUser(authenticate.serializeUser);
passport.deserializeUser(authenticate.deserializeUser);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('url', process.env.ASCOTURL || 'http://localhost:' + app.get('port'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/images/twitterButton.png', {maxAge: 86400000}));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
 
  app.use(express.session({ secret: 'LS295K8NO2O2l8' }));
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.use(function(req, res, next) {
    // Expose URL relative to root in views
    res.locals.url = req.url;
    // Expose query params
    res.locals.query = req.query;
    next();
  });
  
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
app.get('/howto', routes.howto);
app.get('/contact', routes.contact);
app.get('/privacy', routes.privacy);
app.get('/howto/websites', routes.websites);
app.get('/howto/planB', routes.planB);
app.get('/howto/guidelines', routes.guidelines);

var mongoLookFactory = new MongoLookFactory(app.get('url'));

// Looks and search dynamic displays
app.get('/look/:id', look.get(mongoLookFactory));
app.get('/look/:id/iframe', look.iframe(mongoLookFactory));
app.put('/look/:id/published',
    authenticate.ensureAuthenticated,
    look.updatePublishedStatus(mongoLookFactory));

app.get('/tagger/:key/:look', tagger.get(mongoLookFactory));
app.get('/upload', upload.get);
app.get('/random', look.random(mongoLookFactory));
app.get('/brand', look.brand(Look));
app.get('/keywords', look.keywords);
app.get('/all', look.all);
app.get('/favorites', look.favorites(Look));

// JSON queries
app.get('/tags.jsonp', tags.get(mongoLookFactory));
app.get('/filters.json', look.filters(Look));
app.get('/brands.json', product.brands(Look));
app.get('/names.json', product.names(Look));

// Upload
app.post('/image-upload', look.upload(mongoLookFactory, fs, gm, httpGet));

// Set tags for image
app.put('/tagger/:key/:look', tagger.put(mongoLookFactory));

// Upvote image
// JSONP is only possible through GET, so need to use GET =(
app.get('/upvote/:id.jsonp', look.upvote(mongoLookFactory));

//login
app.get('/login', authenticate.login);
app.get('/logout', authenticate.logout);
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    res.redirect('/admin');
  }
);

app.get('/admin', authenticate.ensureAuthenticated, admin.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port') + " on url " + app.get('url'));
});
