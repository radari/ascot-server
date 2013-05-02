/**
 *  upload_handler.js
 *
 *  Created on: May 2, 2013
 *      Author: Valeri Karpov
 *
 *  A wrapper around Knox client
 *
 */

exports.UploadHandler = function(knoxClient, mode) {
  return function(imagePath, remoteName, callback) {
    knoxClient.putFile(imagePath, (mode == 'test' ? '/test/' : '/uploads/') + remoteName, { 'x-amz-acl': 'public-read' }, function(error, result) {
      if (error || !result) {
        callback("error - " + error, null);
      } else {
        callback(null, 'https://s3.amazonaws.com/ascot_uploads' + (mode == 'test' ? '/test/' : '/uploads/') + remoteName);
      }
    });
  };
};