/**
 *  ViewConfig.js
 *
 *  Created on: May 9, 2013
 *      Author: Valeri Karpov
 *
 *  Mongoose model for tweakable frontend parameters in plugin
 *
 */

var Mongoose = require('mongoose');

exports.DISPLAY_TAGS_BEHAVIOR = ["SHOW", "SHOW_ON_MOUSEOVER"];

exports.ViewConfigSchema = new Mongoose.Schema({
  behavior : {
    displayTagsOnInit : { type : String, enum : exports.DISPLAY_TAGS_BEHAVIOR, default : "SHOW" }
  },
  display : {
    tagSizeModifier : { type : Number, min : 0.25, max : 2, default : 1 },
    borderWidth : { type : Number, min : 0, max : 5, default : 2 },
    backgroundColor : { type : String, default : "#171717" }
  }
});