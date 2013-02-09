/*
 *  routes.look.test.js
 *
 *  Created on: January 29, 2012
 *      Author: Valeri Karpov
 *
 *  Nodeunit-based test cases for /routes/look.js
 *
 */

var LookRoutes = require('../routes/look.js')

exports.testGetLook = function(test) {
  var testLook = { title : 'Test Title', _id : 'MYFAKEID' };
  var fn = LookRoutes.get({
    buildFromId : function(id, cb) {
      if (id == 'MYFAKEID') {
        cb(null, testLook);
      } else {
        cb({ error : 'error' }, null);
      }
    }
  });

  fn({ params : { id : 'MYFAKEID' } },
      { render :
        function(view, params) {
          test.equal('look', view, "render correct view");
          test.equal('Ascot :: Test Title', params.title);
          test.equal(testLook, params.look);
          test.done();
        }
      });
};

exports.testGetLookFail = function(test) {
  var testLook = { title : 'Test Title', _id : 'MYFAKEID' };
  var fn = LookRoutes.get({
    buildFromId : function(id, cb) {
      if (id == 'MYFAKEID') {
        cb(null, testLook);
      } else {
        cb({ error : 'error' }, null);
      }
    }
  });

  fn({ params : { id : 'MYBSID' } },
      { render :
        function(view, params) {
          test.equal('error', view, "render correct view");
          test.done();
        }
      });
};

exports.testGetRandom = function(test) {
  var testLook = { title : 'Test Title', _id : 'MYFAKEID' };
  var fn = LookRoutes.random({
    getRandom : function(cb) {
      cb(null, testLook);
    }
  });

  fn({},
      { redirect :
        function(url) {
          test.equal('/look/MYFAKEID', url);
          test.done();
        } 
      });
};

exports.testUpvote = function(test) {
  var saved = false;
  var testLook = {  title : 'Test Title',
                    _id : 'MYFAKEID',
                    numUpVotes : 2,
                    save : function(cb) {
                      saved = true;
                      cb(null, this);
                    }
                  };
  var fn = LookRoutes.upvote({
    buildFromId : function(id, cb) {
      if (id == 'MYFAKEID') {
        cb(null, testLook);
      } else {
        cb({ error : 'error' }, null);
      }
    }
  });

  fn({ params : { id : 'MYFAKEID' }, cookie : {} },
      { jsonp :
        function(json) {
          test.equal(true, saved, "should call save");
          test.equal(undefined, json.error, 'shouldnt have an error');
          test.done();
        },
        cookie :
          function(name, val, params) {
            test.equal(name, 'upvotes', 'should save with correct cookie name');
            test.equal(true, val['MYFAKEID'], 'should save upvote in cookie');
          }
      });
};