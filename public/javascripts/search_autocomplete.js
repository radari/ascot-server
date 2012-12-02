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
        alert(JSON.stringify(filter));
      }
    }).enable();
});
