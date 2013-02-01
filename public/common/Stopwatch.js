/*
 *  Stopwatch.js
 *
 *  Created on: January 30, 2012
 *      Author: Valeri Karpov
 *
 *  Class for computing elapsed time
 *
 */

var exports = exports || {};

exports.Stopwatch = function() {
  this.tagToTimes = {};
  this.tagStart = {};

  this.start = function(tag) {
    this.tagStart[tag] = new Date();
  };

  this.stop = function(tag) {
    var t = new Date() - this.tagStart[tag];
    if (!this.tagToTimes[tag]) {
      this.tagToTimes[tag] = [];
    }

    this.tagToTimes[tag].push(t);
    return t;
  };

  this.average = function(tag) {
    if (!tag in this.tagToTimes) {
      return -1;
    }
    var sum = 0;
    for (var i = 0; i < this.tagToTimes[tag].length; ++i) {
      sum += this.tagToTimes[tag][i];
    }
    return sum / this.tagToTimes[tag].length;
  }
};