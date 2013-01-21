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

function initAscotPlugin($) {
  var getAscotHashParam = function(url) {
    if (url.lastIndexOf('#') == 0) {
      return null;
    } else {
      url = url.substring(url.lastIndexOf('#'));
    }

    var regex = new RegExp('[#|&]' + 'ascot' + '=' + '([^&;]+?)(&|#|\\?|$)');
    var sp = regex.exec(url);

    if (sp == null) {
      return null;
   }
    
    if (sp.length == 0) {
      return null;
    } else {
      var keyValuePair = sp[0];
      var val = keyValuePair.substring('#ascot='.length);
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
      var image = $(el);
      
      var ascotId = getAscotHashParam(url);
      if (ascotId == null && image.parent()) {
        var href = image.parent().attr('href');
        var alt = image.attr('alt');
        if (href && href.toLowerCase().indexOf('ascotproject.com/look/') != -1) {
          ascotId = href.toLowerCase().substr(href.indexOf('ascotproject.com/look/') + 'ascotproject.com/look/'.length, '50f8bae560ad830943000004'.length);
          image.parent().attr('href', '#');
        }
      }
      if (ascotId != null) {
        $.ajax({
          type: 'GET',
          url: 'http://www.ascotproject.com/tags.jsonp?id='
              + encodeURIComponent(ascotId),
          async: true,
          jsonpCallback: 'callback',
          contentType: 'application/jsonp',
          dataType: 'jsonp',
          success: function (json) {
            if (json && json.tags) {
              var height = image.height();
              var width = image.width();
            
              image.wrap('<div class="ascot_overlay_look" />');
              var wrapper = image.parent();
              wrapper.css('width', image.width() + 'px');
              wrapper.css('height', image.height() + 'px');
              
              wrapper.append('<div class="ascot_overlay_animate_button"></div>');
              var animateButton = wrapper.children().last();
              
              wrapper.append('<div class="ascot_overlay"></div>');
              var overlay = wrapper.children().last();
              overlay.css('width', image.width() + 'px');
              overlay.css('height', image.height() + 'px');
              
              overlay.append('<div class="ascot_overlay_image_menu"><ul><li><a target="_blank" href="http://www.ascotproject.com/look/' + ascotId + '"><img src="http://www.ascotproject.com/images/overlayOptions_share.png"></li></a></ul></div>');
              
              overlay.append('<div class="ascot_overlay_source_tag">i<div class="ascot_overlay_source_url">' + json.source + '</div>');
              var sourceTag = overlay.children().last();
              var sourceUrl = sourceTag.children().last();
              
              sourceTag.hover(function() {
                sourceUrl.show(100, function(){});
              },function(){
                sourceUrl.hide(100, function(){});
              });
              
              animateButton.click(function(event) {
                event.stopPropagation();
                overlay.toggle("slide", { direction: "left" }, 500, function(){});
              });
              
              $.each(json.tags, function(i, tag) {
                var tagContainer = $("<div class='ascot_overlay_tag_container'></div>");
                if (height == json.size.height && width == json.size.width) {
                  // Image is default size - no need to scale tags
                  tagContainer.css("left", tag.position.x);
                  tagContainer.css("top", tag.position.y);
                } else {
                  // Image resized by client. Scale tag positions
                  tagContainer.css("left", (tag.position.x / json.size.width) * width);
                  tagContainer.css("top", (tag.position.y / json.size.height) * height);
                }
                
                tagContainer.appendTo(overlay);
                
                var tagName = $("<div class='ascot_overlay_tag_name'>" + tag.index + "</div>")
                tagName.appendTo(tagContainer);
                
                var tagDescription = $("<div class='ascot_overlay_tag_description'></div>");
                tagDescription.html(
                    "<b>" + tag.product.brand + "</b> " + tag.product.name +
                    "<br/>" +
                    (tag.product.buyLink.length > 0 ? "<a target='_blank' href=" + tag.product.buyLink + ">"+"Buy"+"</a><br/>" : "") +
                    (tag.product.price > 0 ? "$" + tag.product.price + "<br/>" : "") +
                    "<a href='http://www.ascotproject.com/brand?v=" + encodeURIComponent(tag.product.brand) + "'>Other looks from " + tag.product.brand + "</a>");

                if (tag.position.x > width / 2.0) {
                  tagDescription.css('right', '10px');
                } else {
                  tagDescription.css('left', '10px');
                }
                
                if (tag.position.y > height / 2.0) {
                  tagDescription.css('bottom', '10px');
                } else {
                  tagDescription.css('top', '10px');
                }
                
                tagDescription.appendTo(tagContainer);
                tagDescription.hide();
                
                tagContainer.hover(function() {
                  tagDescription.show(100, function(){});
                },function(){
                  tagDescription.hide(100, function(){});
                });
              });
              
            }
          }
        });
      }
    });
  });
};
