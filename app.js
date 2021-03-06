
/**
 * Module dependencies.
 */

var express = require('express')

  // External libraries (npm / node specific)
  , bcrypt = require('bcrypt-nodejs')
  , flash = require('connect-flash')
  , assetManager = require('connect-assetmanager')
  , assetHandler = require('connect-assetmanager-handlers')
  , fb = require('facebook-js')
  , fs = require('fs')
  , gm = require('gm')
  , http = require('http')
  , httpGet = require('http-get')
  , safeStringify = require('json-stringify-safe')
  , knox = require('knox')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , path = require('path')
  , url = require('url')

  // Routes
  , routes = require('./routes')
  , admin = require('./routes/admin.js')
  , authenticate = require('./routes/authenticate.js')
  , collection = require('./routes/collection.js')
  , facebook = require('./routes/facebook.js')
  , links = require('./routes/links.js')
  , look = require('./routes/look.js')
  , product = require('./routes/product.js')
  , tagger = require('./routes/tagger.js')
  , tags = require('./routes/tags.js')
  , upload = require('./routes/upload.js')
  , user = require('./routes/user.js')

  
  // Our tools
  , affiliates = require('./routes/tools/affiliates.js')
  , ProductLinkGenerator =
      require('./routes/tools/product_link_generator.js').ProductLinkGenerator
  , Readify = require('./routes/tools/readify.js').readify
  , Shortener = require('./routes/tools/shortener.js').shortener
  , Temp = require('./routes/tools/custom_temp.js').Temp
  , Thumbnail = require('./routes/tools/thumbnail.js').thumbnail
  , UploadHandler = require('./routes/tools/upload_handler.js').UploadHandler;


var app = express();

require('./public/common/basic_tools.js');

// Set up Mongoose / MongoDB interfaces
var MongoLookFactory = require('./factories/MongoLookFactory.js').MongoLookFactory;

var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'ascot', 27017, { user : 'ascot', pass : 'letMeGiveYouAHug' });

var ViewConfigSchema = require('./models/ViewConfig.js').ViewConfigSchema;
var ViewConfig = db.model('viewconfigs', ViewConfigSchema);

var ShortendSchema = require('./models/Shortened.js').ShortenedSchema;
var Shortened = db.model('shortend', ShortendSchema);

var ReadableSchema = require('./models/Readable.js').ReadableSchema;
var Readable = db.model('readable', ReadableSchema);

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

var CollectionSchema = require('./models/Collection.js').CollectionSchema;
var Collection = db.model('collections', CollectionSchema);

var MongoUserFactory = require('./factories/MongoUserFactory.js').MongoUserFactory;
var mongoUserFactory = new MongoUserFactory(User, Password, bcrypt);

var Validator = require('./factories/Validator.js').Validator;
var validator = new Validator(Permissions);

var administratorValidator = authenticate.administratorValidator(Administrator);
var taggerPermissionValidator = tagger.taggerPermissionValidator(validator);

var shopsense = affiliates.shopsense(httpGet);

// configure passport for user auth
var strategy = authenticate.strategyFactory(mongoUserFactory);
passport.use(new LocalStrategy(strategy.localStrategy));
passport.serializeUser(strategy.serializeUser);
passport.deserializeUser(strategy.deserializeUser);

// configure custom tools
var mode = process.env.MODE || 'production';

var temp = new Temp();

var uploadTarget = knox.createClient({
  key : "AKIAJW2LJ5AG2WHBDYIA",
  secret : "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",
  bucket : 'ascot_uploads'
});

var uploadHandler = UploadHandler(uploadTarget, mode);

var gmTagger = require('./routes/tools/gm_tagger.js').gmTagger(gm, temp, fs, httpGet, uploadHandler);

var Goldfinger = require('./routes/tools/goldfinger.js').Goldfinger;
var goldfinger = new Goldfinger(fs, gm, temp, uploadHandler);
goldfinger.setMaxWidth(5000);

var download = require('./routes/tools/download.js').download(httpGet, temp);

var fbConfig = {
  id : (mode == 'test' ? '548575418528005' : '169111373238111'),
  secret : (mode == 'test' ? '254e38966e2513ed7019b25a4af195d1' : '3ed7ae1a5ed36d4528898eb367f058ba')
};
fb.config = fbConfig;

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
  // connect-assetmanager
  //app.use(assets);

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
    // Expose the current url
    res.locals.rootUrl = app.get('url');

    if (res.locals.originalUrl.indexOf('/images/') == 0) {
      res.setHeader('Cache-Control', 'public, max-age=' + (60 * 60 * 24 * 30)); // 30 days
    }

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
app.get('/howto/wordpress', routes.wordpress);
app.get('/howto', routes.howto);
app.get('/contact', routes.contact);
app.get('/privacy', routes.privacy);
app.get('/howto/websites', routes.websites);
app.get('/howto/planB', routes.planB);
app.get('/howto/guidelines', routes.guidelines);
app.get('/disclosures', routes.disclosures);
app.get('/howto/taggerPlugin', routes.taggerPlugin);
app.get('/progress', routes.progress);

var mongoLookFactory = new MongoLookFactory(app.get('url'), Look, Permissions);
var shortener = Shortener(Shortened, 'http://ascotproject.com', function() { return Math.random(); });
var readify = Readify(Readable, app.get('url'));
var linkshare = affiliates.linkshare(httpGet, url, fs, './routes/data/linkshare_retailers.csv');
var productLinkGenerator = ProductLinkGenerator(shortener, readify, shopsense, linkshare);
var thumbnail = Thumbnail(gm, temp);

// Looks and search dynamic displays
app.get('/look/:id', look.get(mongoLookFactory));
app.get('/look/:id/iframe', look.iframe(mongoLookFactory));
app.put('/look/:id/published',
    authenticate.ensureAuthenticated,
    administratorValidator,
    look.updatePublishedStatus(mongoLookFactory));
app.get('/customize/:look',
    taggerPermissionValidator,
    look.customize(mongoLookFactory, ViewConfig));

app.get('/tagger/:look',
    taggerPermissionValidator,
    tagger.get('tagger', mongoLookFactory));
app.get('/upload', upload.get);
app.get('/random', look.random(mongoLookFactory));
app.get('/brand', look.brand(Look));
app.get('/product', look.product(Look));
app.get('/keywords', look.keywords(Look));
app.get('/all', look.all(Look));
app.get('/favorites', look.favorites(Look));
app.get('/collections', collection.getCollections(Collection));

app.get('/user/:user/collection/:collection', user.byUsername(mongoUserFactory), collection.get(Collection));

// JSON queries
app.get('/filters.json', look.filters(Look));
app.get('/brands.json', product.brands(Look));
app.get('/names.json', product.names(Look));
app.get('/links.json', product.links(Look));

// Upload
app.post('/image-upload', look.upload(mongoLookFactory, goldfinger, thumbnail, download, gmTagger));

// Set tags for image
app.put('/tagger/:look',
    taggerPermissionValidator,
    tagger.put(mongoLookFactory, gmTagger, productLinkGenerator));
app.put('/customize/:look',
    taggerPermissionValidator,
    look.setViewConfig(mongoLookFactory, ViewConfig, gmTagger));

// Calls meant for external (i.e. not on ascotproject.com) use
// JSONP is only possible through GET, so need to use GET =(
app.get('/tags.jsonp', tags.get(mongoLookFactory));
app.get('/upvote/:id.jsonp', look.upvote(mongoLookFactory));
app.get('/new/look/:user', look.newLookForUser(mongoLookFactory, mongoUserFactory, goldfinger, download));
app.get('/embed/tagger/:look', tagger.get('mini_tagger', mongoLookFactory));
app.get('/l/:key', links.shortened(shortener));
app.get('/p/:readable/:number', links.readable(readify));

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

app.delete('/admin/look/:id',
  authenticate.ensureAuthenticated,
  administratorValidator,
  admin.deleteLook(mongoLookFactory, Look, User));

app.get('/admin/collection/:collection',
  authenticate.ensureAuthenticated,
  administratorValidator,
  collection.collectionById(Collection),
  admin.editCollection(Look));
app.get('/admin/collections',
  authenticate.ensureAuthenticated,
  administratorValidator,
  admin.getCollections(Collection));

app.put('/admin/collection/:collection',
  authenticate.ensureAuthenticated,
  administratorValidator,
  collection.collectionById(Collection),
  admin.saveCollection(Collection));

app.post('/admin/collection',
  authenticate.ensureAuthenticated,
  administratorValidator,
  admin.newCollection(Collection));

// Routes exposed for E2E testing purposes only
if (app.get('mode') == 'test') {
  app.get('/delete/user/:name.json', user.delete(mongoUserFactory));
  app.get('/delete/look/:id.json', look.delete(mongoLookFactory));
  app.get('/make/admin/:name.json', admin.makeAdmin(Administrator, mongoUserFactory));
}

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port') + " on url " + app.get('url') + " in " + app.get('mode') + " mode.");
});
