/**
 *  Look.js
 *
 *  Created on: November 17, 2012
 *      Author: Valeri Karpov
 *
 *  Mongoose model for looks
 *
 */

var Mongoose = require('mongoose');

exports.LookSchema = new Mongoose.Schema({
  title : { type : String, default : "" },
  url : String, // URL of displayed image
  taggedUrl : String, // URL of image with embedded tags
  random : [ // Array of length 2, (x,y) pair for use with $near
    { type : Number, default : Math.random() },
    { type : Number, default : 0 }
  ],
  source : { type : String, default : "" }, // Source tag URL
  search : [String], // Search keywords for this look
  size : { // Size of image
    height : { type : Number, default : 0 },
    width : { type : Number, default : 0 } 
  },
  showOnCrossList : { type : Number, default : 0 }, // Display on looks_list
  numUpVotes : { type : Number, default : 0 },
  numViews : { type : Number, default : 0 },
  tags : [
    {
      position : { x : Number, y : Number },
      index : Number,
      product : {
        name : String,
        brand : String,
        buyLink : String,
        price : Number, // Optional
        search : [String] // Product search tags
      }
    }
  ]
});

exports.LookSchema.index({ random : '2d' });
