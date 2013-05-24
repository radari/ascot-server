/*
 *  tools.gm_tagger.test.js
 *
 *  Created on: April 19, 2013
 *      Author: Valeri Karpov
 *
 *  Nodeunit-based test cases for /routes/tools/gm_tagger.js
 *
 */

var gmTagger = require('../routes/tools/gm_tagger.js').gmTagger;

exports.testRun = function(test) {
  var mockTestPath = '/tmp/bs';

  var mockLook = {
    _id : '1234',
    url : 'http://www.ascotproject.com',
    taggedUrl : '',
    tags : [
      { position : { x : 25, y : 25 } }
    ],
    save : function(callback) {
      test.equal('A', 'A');
      callback(null, mockLook);
    }
  }

  var commands = [];

  var mockGm = function(path) {
    var obj = {
      fill : function(color) {
        commands.push('fill');
        return obj;
      },
      stroke : function(color) {
        commands.push('stroke');
        return obj;
      },
      drawCircle : function(x1, y1, x2, y2) {
        commands.push('drawCircle');
        return obj;
      },
      strokeWidth : function(width) {
        commands.push('strokeWidth');
        return obj;
      },
      font : function(font) {
        commands.push('font');
        return obj;
      },
      fontSize : function(s) {
        commands.push('fontSize');
        return obj;
      },
      drawText : function(x, y, text, orient) {
        commands.push('drawText');
        return obj;
      },
      write : function(path, callback) {
        test.equal(path, mockTestPath);
        callback(null);
      }
    };

    test.equal(mockTestPath, path);
    return obj;
  };

  var mockTemp = {
    open : function(prefix, callback) {
      test.equal('A', 'A');
      callback(null, { path : mockTestPath });
    }
  };

  var mockFs = {
    unlink : function(path, callback) {
      test.equal(path, mockTestPath);
      callback(null);
    }
  };

  var mockHttpGet = {
    get : function(url, path, callback) {
      test.equal(url, mockLook.url);
      test.equal(path, mockTestPath);
      callback(null);
    }
  };

  var mockUploadHandler = function(path, result, callback) {
    test.equal(path, mockTestPath);
    test.equal(result, 'tagged_1234.png');
    callback(null, 'http://test/1234');
  };

  var tagger = gmTagger(mockGm, mockTemp, mockFs, mockHttpGet, mockUploadHandler);

  tagger(mockLook, function(error, look) {
    test.equal('http://test/1234', look.taggedUrl);
    test.equal(10, commands.length);
    test.expect(11);
    test.done();
  });
};