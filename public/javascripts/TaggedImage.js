/*
 *  TaggedImage.js
 *
 *  Created on: December 5, 2012
 *      Author: Valeri Karpov
 *
 *  Low level functionality for dealing with an image an id and a list of tags.
 *
 */

var TaggedImage = function(id, tags) {
  this.id = id;
  this.tags = tags;

  this.addTag = function(tag) {
    return this.tags.push(tag);
  };

  this.deleteTag = function(tag) {
    var index = -1;
    for (var i = 0; i < tags.length; ++i) {
      if (tags[i] == tag) {
        index = i;
      }
    }

    if (index == -1) {
      return false;
    } else {
      for (var i = 0; i < tags.length; ++i) {
        if (i > index) {
          tags[i - 1] = tags[i];
        }
      }
      // jQuery method
      tags.remove(-1);

      return true;
    }
  };
};
