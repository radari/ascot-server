

//
// GET /login
//

var users = [
  { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' },
  { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}


exports.login = function(req, res) {
  res.render('login', { title : 'Ascot :: Login' });
};

exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
};

exports.localStrategy = function(username, password, done) {
  User.findOne({ username: username }, function (err, user) {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!user.validPassword(password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  });
};

exports.serializeUser = function(user, done) {
  done(null, user.id);
};

exports.deserializeUser = function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
};














