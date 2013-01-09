/*
 *  ascot_plugin.js
 *
 *  Created on: January 7, 2012
 *      Author: Valeri Karpov
 *
 *  Completely independent Javascript plugin for displaying Ascot overlay
 *  on all images with the 'ascot' hash parameter
 *
 */

var getAscotHashParam = function(url) {
  if (url.lastIndexOf('#') == 0) {
    return null;
  } else {
    url = url.substring(url.lastIndexOf('#'));
  }

  var regex = new RegExp('[#|&]' + 'ascot' + '=' + '([^&;]+?)(&|#|\\?|$)');
  var sp = regex.exec(url);
  
  if (sp.length == 0) {
    return null;
  } else {
    var keyValuePair = sp[0];
    var val = keyValuePair.substring('#ascot='.length);
    alert(val.charAt(val.length - 1))
    if (val.charAt(val.length - 1) == '&' ||
        val.charAt(val.length - 1) == '#' ||
        val.charAt(val.length - 1) == '?') {
      val = val.substring(0, val.length - 1);
    }
    return decodeURIComponent(val);
  }
};

$(document).ready(function() {
  $('img').each(function(index, el) {
    var url = $(el).attr('src').toLowerCase();
    var lookId;
    
    var ascotId = getAscotHashParam(url);
    if (ascotId != null) {
      
    }
  });
});
