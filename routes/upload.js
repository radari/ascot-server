/**
 *  upload.js
 *
 *  Created on: November 18, 2012
 *      Author: Valeri Karpov
 *
 *  Routes for uploading image
 *
 */

exports.get = function(req, res) {
  res.render('upload', { title : "Upload Image" });
};
