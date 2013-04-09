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
  
  var mockMongoLookFactory = {
    buildFromId : function(id, cb) {
      if (id == 'MYFAKEID') {
        cb(null, testLook);
      } else {
        cb({ error : 'error' }, null);
      }
    }
  };
  
  var fn = LookRoutes.get(mockMongoLookFactory);

  fn( // Mock req
      { params : { id : 'MYFAKEID' } },
      // Mock res
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
      { redirect : function(url) {
          test.equal('/look/MYFAKEID', url);
        },
        json : function(object) {
          test.equal(testLook, object);
        },
        format : function(format) {
          format.html();
          format.json();
          test.expect(2);
          test.done();
        }
      });
};

exports.testHandleUpload = function(test) {
  var mockHandle = { path : '/test/bs' };
  
  var height = 200;
  var width = 250;
  var mockLook = { 
      '_id' : 'MYFAKEID',
      save : function(callback) { callback(null, mockLook); },
      size : {}
  };
  var mockPermissions = { '_id' : 'BS123' };
  
  var mockMongoLookFactory = {
    newLook : function(user, callback) {
      callback(null, mockLook, mockPermissions);
    }
  };
  
  var mockFs = {
    unlink : function(path, callback) {
      test.equal(path, mockHandle.path);
      callback(null);
    } 
  };
  
  var mockGm = function(path) {
    test.equal(path, mockHandle.path);
    return {
      size : function(callback) {
        callback(null, { height : height, width : width });
      }
    };
  };

  var mockUploadHandler = function(path, target, callback) {
    test.equal(path, mockHandle.path);
    test.equal(target, 'MYFAKEID.png');
    callback(null, 'http://bs/MYFAKEID');
  };
  
  LookRoutes.handleUpload(
      null,
      mockHandle,
      mockMongoLookFactory,
      mockFs,
      mockGm,
      mockUploadHandler,
      function(error, look, permissions) {
        test.equal(null, error);
        test.equal(mockLook, look);
        test.equal(mockPermissions, permissions);
        test.equal('http://bs/MYFAKEID', look.url);
        test.expect(8);
        test.done();
      });
};

exports.testFilters = function(test) {
  var query = 'tes';

  var mockLook = {
    distinct : function(d) {
      return this;
    },
    where : function(d) {
      return this;
    },
    regex : function(d) {
      return this;
    },
    exec : function(callback) {
      test.ok(true);
      callback(null, ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9', 'bs']);
    }
  };

  var fn = LookRoutes.filters(mockLook);
  fn({ query : { query : query } },
      { json : function(data) {
          test.equal(data.length, 9);
          test.equal('test1', data[1].v);
          test.equal(data[0].type, 'Keyword');
          test.equal(data[1].type, 'Brand');
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
          test.expect(4);
          test.done();
        },
        cookie :
          function(name, val, params) {
            test.equal(name, 'upvotes', 'should save with correct cookie name');
            test.equal(true, val['MYFAKEID'], 'should save upvote in cookie');
          }
      });
};
