/*
 *  search_autocomplete.js
 *
 *  Created on: December 1, 2012
 *      Author: Valeri Karpov
 *
 *  Frontend for main header search autocomplete
 *
 */


$(document).ready(function() {
  var auto = $("#main_search").autocomplete({
      serviceUrl : '/filters.json',
      minChars : 2,
      delimiter : /(,|;)\s*/, // regex or character
      zIndex : 1000,
      deferRequestBy : 0,
      onSelect : function(str, filter) {
        if (filter.type == "Brand") {
          $(location).attr('href', '/brand?v=' + encodeURIComponent(filter.v));
        } else if (filter.type == "Type") {
          $(location).attr('href', '/type?v=' + encodeURIComponent(filter.v));
        } else {
          alert("Unknown filter type '" + filter.type + "'");
        }
      }
    }).enable();
});
