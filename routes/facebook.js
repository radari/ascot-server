/**
 *  facebook.js
 *
 *  Created on: April 17, 2013
 *      Author: Valeri Karpov
 *
 *  Routes for dealing with Facebook
 *
 */

/*
 * GET /fb/authorize[?redirect=<redirect>]
 */
exports.authorize = function(fb, url) {
  return function(req, res) {
    var redirect = url + '/fb/access';
    if (req.query.redirect) {
      redirect += '?redirect=' + encodeURIComponent(req.query.redirect);
    }
    res.redirect(fb.getAuthorizeUrl({
      client_id: '169111373238111',
      redirect_uri: redirect,
      scope: 'publish_stream,user_photos,photo_upload'
    }));
  };
};

/*
 * GET /fb/access[?redirect=<redirect>]
 */
exports.access = function(fb, url) {
  return function(req, res) {
    var redirect = url + '/fb/access';
    if (req.query.redirect) {
      redirect += '?redirect=' + encodeURIComponent(req.query.redirect);
    }
    fb.getAccessToken(
      '169111373238111',
      '3ed7ae1a5ed36d4528898eb367f058ba',
      req.param('code'),
      redirect, 
      function (error, access_token, refresh_token) {
        console.log("## " + JSON.stringify(error) + " " + access_token + " " + refresh_token);
        if (error || !access_token) {
          res.redirect('/fb/authorize' +
              (req.query.redirect ? '?redirect=' + encodeURIComponent(req.query.redirect) : ''));
        } else {
          res.cookie('fbToken', access_token);
          console.log(access_token);
          res.redirect(req.query.redirect || '/');
        }
      });
  };
};

exports.checkAccessToken = function(fb) {
  return function(req, res, next) {
    if (req.cookies.fbToken) {
      fb.apiCall('GET', '/me', { access_token : req.cookies.fbToken}, function(error, response, body) {
        if (error || body.error) {
          res.redirect('/fb/authorize?redirect=' + req.originalUrl);
        } else {
          next();
        }
      });
    } else {
      res.redirect('/fb/authorize?redirect=' + req.originalUrl);
    }
  };
}

/*
 * GET /fb/upload/:look
 */
exports.upload = function(fb, mongoLookFactory, url) {
  return function(req, res) {
    mongoLookFactory.buildFromId(req.params.look, function(error, look) {
      if (error || !look) {
        res.render('error', { title : 'Ascot :: Error', error : error || "Look not found" });
      } else {
        var numMinified = 0;

        var finish = function() {
          var msg = '';
          for (var i = 0; i < look.tags.length; ++i) {
            msg += (i + 1) + '. ' + look.tags[i].product.brand + ' ' + look.tags[i].product.name;
            if (look.tags[i].product.buyLinkMinified) {
              msg += ' ' + look.tags[i].product.buyLinkMinified + '\n';
            } else {
              msg += '\n';
            }
          }
          res.render('facebook_upload', { title : 'Facebook Upload', look : look, defaultMessage : msg });
        }

        finish();
      }
    });
  };
};

/*
 * POST /fb/upload/:look
 */
exports.postUpload = function(fb, mongoLookFactory, url) {
  return function(req, res) {
    mongoLookFactory.buildFromId(req.params.look, function(error, look) {
      fb.apiCall('POST', '/me/photos', { access_token : req.cookies.fbToken, url : look.taggedUrl, message : req.body.message }, function(error, response, body) {
        console.log(error + " " + response + " " + JSON.stringify(body));
        req.flash('/fb/upload/' + look._id, 'Successfully uploaded!');
        res.redirect('/fb/upload/' + look._id);
      });
    });
  };
};