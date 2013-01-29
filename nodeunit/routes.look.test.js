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
  var viewName = "";
  var viewParams = {};

  var testLook = { title : 'Test Title', id : 'MYFAKEID' };
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