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

  var fn = LookRoutes.get('localhost:3000');
  fn({ params : { id : '50be5616715bb7bf22000004' } },
      { render :
        function(view, params) {
          test.equal('look', view, "render correct view");
          test.done();
        }
      });
};