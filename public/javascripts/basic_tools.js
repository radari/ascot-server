/*
 *  basic_tools.js
 *
 *  Created on: December 5, 2012
 *      Author: Valeri Karpov
 *
 *  Some utility-type methods added to certain built-in Javascript types
 *  (Array, etc.) that make life much easier
 *
 */

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
