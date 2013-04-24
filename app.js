
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
  , user = require('./routes/user.js')
  , fb = require('facebook-js')
  , facebook = require('./routes/facebook.js')
  , safeStringify = require('json-stringify-safe')

  , affiliates = require('./routes/tools/affiliates.js')

  , http = require('http')
  , httpGet = require('http-get')
  , path = require('path')
  , fs = require('fs')
  , gm = require('gm')
  , flash = require('connect-flash')
  , Shortener = require('./routes/tools/shortener.js').shortener
  
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , knox = require('knox')
  //, Bitly = require('bitly')
  , bcrypt = require('bcrypt-nodejs');


var app = express();

require('./public/common/basic_tools.js');

// Set up Mongoose / MongoDB interfaces
var MongoLookFactory = require('./factories/MongoLookFactory.js').MongoLookFactory;

var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'ascot', 27017, { user : 'ascot', pass : 'letMeGiveYouAHug' });

var ShortendSchema = require('./models/Shortened.js').ShortenedSchema;
var Shortened = db.model('shortend', ShortendSchema);

var LookSchema = require('./models/Look.js').LookSchema;
var Look = db.model('looks', LookSchema);

var PermissionsSchema = require('./models/Permissions.js').PermissionsSchema;
var Permissions = db.model('permissions', PermissionsSchema);

var UserSchema = require('./models/User.js').UserSchema;
var User = db.model('users', UserSchema);

var PasswordSchema = require('./models/Password.js').PasswordSchema;
var Password = db.model('passwords', PasswordSchema);

var AdministratorSchema = require('./models/Administrator.js').AdministratorSchema;
var Administrator = db.model('administrators', AdministratorSchema);

var MongoUserFactory = require('./factories/MongoUserFactory.js').MongoUserFactory;
var mongoUserFactory = new MongoUserFactory(User, Password, bcrypt);

var Validator = require('./factories/Validator.js').Validator;
var validator = new Validator(Permissions);

var administratorValidator = authenticate.administratorValidator(Administrator);

var shopsense = affiliates.shopsense(httpGet);

// configure passport for user auth
var strategy = authenticate.strategyFactory(mongoUserFactory);
passport.use(new LocalStrategy(strategy.localStrategy));
passport.serializeUser(strategy.serializeUser);
passport.deserializeUser(strategy.deserializeUser);

// configure custom tools
var mode = process.env.MODE || 'production';
var Temp = function() {
  this.counter = 0;
  this.baseDirectory = './public/images/uploads/';

  this.open = function(prefix, callback) {
    callback(null, { path : this.baseDirectory + prefix + (++this.counter) });
  };
};
var temp = new Temp();

var uploadTarget = knox.createClient({
  key : "AKIAJW2LJ5AG2WHBDYIA",
  secret : "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",
  bucket : 'ascot_uploads'
});

var uploadHandler = function(uploadTarget, mode) {
  return function(imagePath, remoteName, callback) {
    console.log("$$ " + imagePath);
    uploadTarget.putFile(imagePath, (mode == 'test' ? '/test/' : '/uploads/') + remoteName, { 'x-amz-acl': 'public-read' }, function(error, result) {
      if (error || !result) {
        callback("error - " + error, null);
      } else {
        callback(null, 'https://s3.amazonaws.com/ascot_uploads' + (mode == 'test' ? '/test/' : '/uploads/') + remoteName);
      }
    });
  };
}(uploadTarget, mode);

var gmTagger = require('./routes/tools/gm_tagger.js').gmTagger(gm, temp, fs, httpGet, uploadHandler);

var Goldfinger = require('./routes/tools/goldfinger.js').Goldfinger;
var goldfinger = new Goldfinger(fs, gm, temp, uploadHandler);
goldfinger.setMaxWidth(700);

var download = require('./routes/tools/download.js').download(httpGet, temp);

var imageMapTagger = require('./routes/tools/image_map_tagger.js').imageMapTagger(gmTagger);

//var bitly = new Bitly('ascotproject', 'R_3bb230d429aa1875ec863961ad1541bd');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('url', process.env.ASCOTURL || 'http://localhost:' + app.get('port'));
  // Default to production mode, since test mode gives additional functionality
  app.set('mode', mode);
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
  

  // For req.flash
  app.use(flash());
  
  app.use(function(req, res, next) {
    // Expose URL relative to root in views
    res.locals.url = req.url;
    // Expose query params
    res.locals.query = req.query;
    // Expose user
    res.locals.user = req.user;
    // Expose URL relative to root with params
    res.locals.originalUrl = req.originalUrl;
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
app.get('/disclosures', routes.disclosures);
app.get('/howto/taggerPlugin', routes.taggerPlugin);

var mongoLookFactory = new MongoLookFactory(app.get('url'), Look, Permissions);
var shortener = Shortener(Shortened, 'http://ascotproject.com', function() { return Math.random(); });

// Looks and search dynamic displays
app.get('/look/:id', look.get(mongoLookFactory));
app.get('/look/:id/iframe', look.iframe(mongoLookFactory));
app.put('/look/:id/published',
    authenticate.ensureAuthenticated,
    administratorValidator,
    look.updatePublishedStatus(mongoLookFactory));

app.get('/tagger/:look', tagger.get('tagger', validator, mongoLookFactory));
app.get('/upload', upload.get);
app.get('/random', look.random(mongoLookFactory));
app.get('/brand', look.brand(Look));
app.get('/keywords', look.keywords(Look));
app.get('/all', look.all(Look));
app.get('/favorites', look.favorites(Look));

// JSON queries
app.get('/filters.json', look.filters(Look));
app.get('/brands.json', product.brands(Look));
app.get('/names.json', product.names(Look));

// Upload
app.post('/image-upload', look.upload(mongoLookFactory, goldfinger, download, gmTagger));

// Set tags for image
app.put('/tagger/:look', tagger.put(validator, mongoLookFactory, shopsense, gmTagger, shortener));

// Calls meant for external (i.e. not on ascotproject.com) use
// JSONP is only possible through GET, so need to use GET =(
app.get('/tags.jsonp', tags.get(mongoLookFactory));
app.get('/upvote/:id.jsonp', look.upvote(mongoLookFactory));
app.get('/new/look/:user', look.newLookForUser(mongoLookFactory, mongoUserFactory, goldfinger, download));
app.get('/embed/tagger/:look', tagger.get('mini_tagger', mongoLookFactory));
app.get('/l/:key', function(req, res) {
  shortener.longify(req.params.key, function(error, url) {
    if (error || !url) {
      res.render('error', { title : 'Ascot :: Error', error : "Invalid link" });
    } else {
      res.redirect(url);
    }
  })
});

// login
app.get('/login',
  authenticate.login
);

app.get('/logout', authenticate.logout);
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  authenticate.onSuccessfulLogin
);

// registration
app.post('/register', authenticate.createUser(mongoUserFactory));

// Authenticated displays for users
app.get('/home', authenticate.ensureAuthenticated, look.myLooks(Look));
app.get('/settings', authenticate.ensureAuthenticated, user.settings);

// Authenticated functionality for users
app.put('/user/settings',
    authenticate.ensureAuthenticated,
    user.saveSettings(User));

// Facebook functionality
app.get('/fb/authorize', facebook.authorize(fb, app.get('url')));
app.get('/fb/access', facebook.access(fb, app.get('url')));
app.get('/fb/upload/:look', facebook.checkAccessToken(fb), facebook.upload(fb, mongoLookFactory, app.get('url')));

app.post('/fb/upload/:look', facebook.checkAccessToken(fb), facebook.postUpload(fb, mongoLookFactory, app.get('url')));

// Admin
app.get('/admin',
  authenticate.ensureAuthenticated,
  administratorValidator,
  function(req, res) {
    res.redirect('/admin/index');
  });

app.get('/admin/index',
  authenticate.ensureAuthenticated,
  administratorValidator,
  admin.index(Look));

app.get('/admin/users',
  authenticate.ensureAuthenticated,
  administratorValidator,
  admin.users(User));

// Routes exposed for E2E testing purposes only
if (app.get('mode') == 'test') {
  app.get('/delete/user/:name.json', user.delete(mongoUserFactory));
  app.get('/delete/look/:id.json', look.delete(mongoLookFactory));
  app.get('/make/admin/:name.json', admin.makeAdmin(Administrator, mongoUserFactory));
}

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port') + " on url " + app.get('url') + " in " + app.get('mode') + " mode.");
});
