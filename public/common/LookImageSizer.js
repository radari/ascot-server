/**
 *  LookImageSizer.js
 *
 *  Created on: February 21, 2013
 *      Author: Valeri Karpov
 *
 *  Common code for determining how big each image in a set should be so as
 *  to fill out its row 
 *
 */

var exports = exports || {};

exports.createLookImageSizer = function(looks, numPerRow, maxWidth) {
  var totalRowWidth = [];
  var totalRowHeight = [];
  var totalAspect = [];
  var numInRow = [];
  for (var i = 0; i < looks.length; i += numPerRow) {
    totalRowWidth.push(0);
    totalRowHeight.push(0);
    totalAspect.push(0);
    numInRow.push(0);
    var row = i / numPerRow;
    for (var j = 0; j < numPerRow && i + j < looks.length; ++j) {
      totalRowWidth[row] += looks[i + j].size.width;
      totalRowHeight[row] += looks[i + j].size.height;
      // Total width of the row if all images have size 1
      totalAspect[row] += (looks[i + j].size.width / looks[i + j].size.height);
      numInRow[row] += 1;
    }
  }

  return {
    getWidth : function(index) {
      return Math.floor((this.getHeight(index) / looks[index].size.height) * looks[index].size.width);
    },
    getHeight : function(index) {
      var row = Math.floor(index / numPerRow);
      return Math.min(Math.floor(maxWidth / totalAspect[row]), 250);
    }
  };
};
