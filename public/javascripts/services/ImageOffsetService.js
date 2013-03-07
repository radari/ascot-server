/*
 *  ImageOffsetService.js
 *
 *  Created on: December 6, 2012
 *      Author: Valeri Karpov
 *
 *  Angular interface for getting image offset
 *
 */

angular.module('AscotImageModule', []).
    factory('$imagePosition', [function() {
      var idsToImages = {};
      $("img[ascot_id]").each(function(i, el) {
        idsToImages[$(el).attr("ascot_id")] = $(el);
      });

      return {
        getOffset : function(id) {
          if (idsToImages[id]) {
            return { x : idsToImages[id].offset().left, y : idsToImages[id].offset().top };
          } else {
            return null;
          }
        },
        getHeight : function(id) {
          if (idsToImages[id]) {
            return idsToImages[id].height();
          } else {
            return 0;
          }
        },
        getWidth : function(id) {
          if (idsToImages[id]) {
            return idsToImages[id].width();
          } else {
            return 0;
          }
        }
      };
    }]);
