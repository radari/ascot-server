/**
 *  admin.js
 *
 *  Created on: February 10, 2012
 *      Author: Matt Green
 *
 *  Routes for an admin interface
 *
 */

var authenticate = require('./authenticate.js');
var createLookImageSizer = require('../public/common/LookImageSizer').createLookImageSizer;

var looksList = require('./common.js').looksList;

/*
 * GET /make/admin/:name.json
 */
exports.makeAdmin = function(Administrator, mongoUserFactory) {
  return function(req, res) {
    mongoUserFactory.findByUsername(req.params.name, function(error, user) {
      if (error || !user) {
        res.json({ error : error });
      } else {
        var a = new Administrator({ user : user._id });
        a.save(function(error, admin) {
          if (error || !admin) {
            res.json({ error : error });
          } else {
            res.json({ success : true });
          }
        });
      }
    });
  };
};

exports.index = function(Look) {
  return function(req, res) {
    var p = req.query["p"] || 0;
    var sortBy = req.query["sortBy"] || "";
  
    looksList(
      Look,
      'admin',
      {},
      'Admin',
      p,
      sortBy,
      '/admin/index',
      res
    );
  };
};

exports.users = function(User) {
  return function(req, res) {
    User.find({}).populate('looks').exec(function(error, users) {
      res.render('admin/users', { users : users, title : 'Admin Users' });
    });
  };
};

/**
  * DELETE /admin/look/:id
  */
exports.deleteLook = function(mongoLookFactory, User, Permissions) {
  return function(req, res) {
    var usersDone = false;
    var permissionsDone = false;

    var finish = function() {
      mongoLookFactory.buildFromId(req.params.id, function(error, look) {
        look.remove(function(error) {
          res.json({ success : true });
        });
      });
    };

    User.find({ $or : [{ looks : req.params.id }, { favorites : req.params.id }] }, function(error, users) {
      var usersCount = 0;
      for (var i = 0; i < users.length; ++i) {
        users[i].looks.remove(req.params.id);
        users[i].favorites.remove(req.params.id);
        users[i].save(function() {
          if (++usersCount >= users.length) {
            usersDone = true;
            if (permissionsDone && usersDone) {
              finish();
            }
          }
        });
      };
      if (users.length == 0) {
        usersDone = true;
        if (permissionsDone && usersDone) {
          finish();
        }
      }
    });
    Permissions.find({ looks : req.params.id }, function(error, permissions) {
      var permissionsCount = 0;
      for (var i = 0; i < permissions.length; ++i) {
        permissions[i].images.remove(req.params.id);
        permissions[i].save(function() {
          if (++permissionsCount >= permissions.length) {
            permissionsDone = true;
            if (permissionsDone && usersDone) {
              finish();
            }
          }
        });
      }
      if (permissions.length == 0) {
        permissionsDone = true;
        if (permissionsDone && usersDone) {
          finish();
        }
      }
    });
  }
};

/**
  * GET /admin/collection/:collection
  */
exports.editCollection = function(Look) {
  return function(req, res) {
    var MAX_PER_PAGE = 20;
    var p = req.query["p"] || 0;

    Look.find({}).count(function(error, count) {
      Look.
          find({}).
          sort({ _id : -1 }).
          limit(MAX_PER_PAGE).skip(p * MAX_PER_PAGE).
          exec(function(error, looks) {
            if (error || !looks) {
              res.format({
                  'html' :
                    function() {
                      res.render('error',
                        { title : "Ascot :: Error", error : "Couldn't load looks'" });
                    },
                  'json' :
                    function() {
                      res.json({ error : error });
                    }
              });
            } else {
              res.format({
                  'html' :
                    function() {
                      console.log("--> " + JSON.stringify(req.collection));
                      res.render('admin/collection',
                        { looks : looks,
                          listTitle : 'All Looks',
                          title : 'Ascot :: All Looks',
                          page : p,
                          collection : req.collection,
                          numPages : Math.ceil((count + 0.0) / (MAX_PER_PAGE + 0.0))});
                    },
                  'json' :
                    function() {
                      res.json({ looks : looks });
                    }
              });
            }
          });
    });
  };
};

/**
  * GET /admin/collections
  */
exports.getCollections = function(Collection) {
  return function(req, res) {
    Collection.find({ owner : req.user._id }, function(error, collections) {
      if (error || !collections) {
        res.render('error', { title : 'Ascot :: Error', error : 'error - ' + error });
      } else {
        res.render('admin/collections', { title : 'Ascot :: Collections', collections : collections });
      }
    });
  };
};

/**
  * PUT /admin/collection/:collection
  */
exports.saveCollection = function() {
  return function(req, res) {
    req.collection.title = req.body.title;
    req.collection.looks = [];
    for (var i = 0; i < req.body.looks.length; ++i) {
      req.collection.looks.push(req.body.looks[i]._id);
    }
    req.collection.save(function(error, collection) {
      if (error || !collection) {
        res.json({ error : error });
      } else {
        res.json({ collection : collection });
      }
    });
  };
};

/**
  * POST /admin/collection
  */
exports.newCollection = function(Collection) {
  return function(req, res) {
    var c = new Collection({ looks : [], owner : req.user._id });
    c.save(function(error, c) {
      if (error || !c) {
        res.render('error', { title : 'Ascot :: Error', error : 'Error - ' + error });
      } else {
        res.redirect('/admin/collection/' + c._id);
      }
    });
  };
};
