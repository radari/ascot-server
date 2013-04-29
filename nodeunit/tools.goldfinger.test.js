/*
 *  tools.goldfinger.test.js
 *
 *  Created on: April 19, 2013
 *      Author: Valeri Karpov
 *
 *  Nodeunit-based test cases for /routes/tools/goldfinger.js
 *
 */

var Goldfinger = require('../routes/tools/goldfinger.js').Goldfinger;

exports.testRun = function(test) {
  var mockPath = '/test/bs';
  var mockFeatures = {
    height : 100,
    width : 100
  };

  var mockResultPath = 'test1234';
  var mockUrl = 'http://test/1234';

  var mockFs = {
    unlink : function(path, callback) {
      test.equal(path, mockPath);
      callback(null);
    }
  };

  var mockGm = function(path) {
    return {
      size : function(callback) {
        callback(null, mockFeatures);
      }
    };
  };

  var mockTemp = {
    open : function(prefix, callback) {
      test.equal('A', 'A');
      callback(null, { path : mockPath });
    }
  };

  var mockUploadHandler = function(path, result, callback) {
    test.equal(path, mockPath);
    test.equal(result, mockResultPath);
    callback(null, mockUrl);
  };

  var goldfinger = new Goldfinger(mockFs, mockGm, mockTemp, mockUploadHandler);

  goldfinger.toS3(mockPath, mockResultPath, function(error, result) {
    test.equal(result, mockUrl);
    test.expect(4);
    test.done();
  });
};

exports.testRunLarge = function(test) {
  var mockPath = '/test/bs';
  var mockFeatures = {
    height : 2000,
    width : 1000
  };

  var mockResultPath = 'test1234';
  var mockUrl = 'http://test/1234';

  var mockFs = {
    unlink : function(path, callback) {
      test.equal(path, mockPath);
      callback(null);
    }
  };

  var mockGm = function(path) {
    var ret = {
      size : function(callback) {
        callback(null, mockFeatures);
      },
      resize : function(width, height) {
        test.equal(height, 1400);
        test.equal(width, 700);
        return ret;
      },
      write : function(path, callback) {
        test.equal(path, mockPath);
        callback(null);
      }
    };
    return ret;
  };

  var mockTemp = {
    open : function(prefix, callback) {
      test.equal('A', 'A');
      callback(null, { path : mockPath });
    }
  };

  var mockUploadHandler = function(path, result, callback) {
    test.equal(path, mockPath);
    test.equal(result, mockResultPath);
    callback(null, mockUrl);
  };

  var goldfinger = new Goldfinger(mockFs, mockGm, mockTemp, mockUploadHandler);

  goldfinger.toS3(mockPath, mockResultPath, function(error, result) {
    test.equal(result, mockUrl);
    test.expect(7);
    test.done();
  });
};