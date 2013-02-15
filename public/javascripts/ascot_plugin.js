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



function initAscotPlugin($, tagSourceUrl) {
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

  window.ascotUpvoteLook = function(ascotId) {
    $.ajax({
      type: 'GET',
      url: tagSourceUrl + '/upvote/' + ascotId + '.jsonp',
      async: true,
      jsonpCallback: 'callback',
      contentType: 'application/jsonp',
      dataType: 'jsonp',
      success : function(json) {
        if (!json.error) {
          $("#ascot_upvote_" + ascotId).attr('src', tagSourceUrl + '/images/overlayOptions_heart_small_opaque.png');
          $("#ascot_upvote_" + ascotId).css('cursor', '');
          $("#ascot_upvote_" + ascotId).css('opacity', '1');
        } else {
          // Nothing to do here for now, just ignore
        }
      }
    });
  };

  $('body').imagesLoaded(function() {
    // Wait for ALL images to load. Certainly not best way to do this, but
    // easiest.
   
    // List of all images
    var images = $('img').get();

    var ascotify = function(index, el) {
      // This function is recursively called when ajax/jsonp call out to
      // ascotproject.com is done - this lets us queue up requests and avoid
      // issues with browser simultaneous request limits
      var url = $(el).attr('src').toLowerCase();
      var lookId;
      var image = $(el);
      
      var ascotId = getAscotHashParam(url);

      // This is really only useful for Tumblr and other places which insist on
      // only showing images stored on their servers. On our end we can just use
      // the #ascot notation, so just hardcode the ascotproject.com stuff for now
      if (ascotId == null && image.parent()) {
        var href = image.parent().attr('href');
        var alt = image.attr('alt');
        if (href && href.toLowerCase().indexOf('ascotproject.com/look/') != -1) {
          ascotId = href.toLowerCase().substr(href.indexOf('ascotproject.com/look/') + 'ascotproject.com/look/'.length, '50f8bae560ad830943000004'.length);
          //image.parent().attr('href', '');
        }
      }

      if (ascotId != null) {
        $.ajax({
          type: 'GET',
          url: tagSourceUrl + '/tags.jsonp?id='
              + encodeURIComponent(ascotId),
          async: true,
          jsonpCallback: 'callback',
          contentType: 'application/jsonp',
          dataType: 'jsonp',
          success: function (json) {
            if (json && json.look && json.look.tags) {
              var data = json;
              json = json.look;

              var htmlifyTags = function(look) {
                var ret = look.title;
                ret += (look.source.length > 0 ? "\n<br>\nSource: " + look.source : "");
                ret += "\n<br>\n<br>\n";
                for (var i = 0; i < look.tags.length; ++i) {
                  var tag = look.tags[i];
                  ret += (i > 0 ? "\n<br>\n" : "");
                  ret += "<a href='" + tag.product.buyLink + "'>" + 
                      "<b>" + tag.product.brand + "</b> " + tag.product.name +
                      "</a>"; 
                };
                return ret;
              };

              var tumblrUrl = 'http://www.tumblr.com/share/photo?' +
                  'source=' + encodeURIComponent(json.url) +
                  '&clickthru=' + encodeURIComponent('http://www.ascotproject.com/look/' + json._id) +
                  '&caption=' + encodeURIComponent(htmlifyTags(json)) +
                  '&tags=ascot';

              var twitterUrl = "https://twitter.com/share"
              var twitterDataUrl = "http://www.ascotproject.com/look/" + json._id;

              var iframeCode = '<iframe src="http://www.ascotproject.com/look/' + json._id + '/iframe" width="' + json.size.width + '" height="' + json.size.height + '" frameborder="0"></iframe>';

              var height = image.height();
              var width = image.width();
            
              image.wrap('<div class="ascot_overlay_look" />');
              var wrapper = image.parent();
              wrapper.css('width', image.width() + 'px');
              wrapper.css('height', image.height() + 'px');

              image.css('position', 'absolute');
              image.css('top', '0px');
              image.css('left', '0px');
              
              wrapper.append('<div class="ascot_overlay_animate_button"></div>');
              var animateButton = wrapper.children().last();
              
              wrapper.append('<div class="ascot_overlay"></div>');
              var overlay = wrapper.children().last();
              overlay.css('width', image.width() + 'px');
              overlay.css('height', image.height() + 'px');
              
              overlay.append(
                '<div class="shareMenu" style="right: 152px; width: 142px; top: 35px;"><div class="shareArrow" style="left: 130px;">' +
                '<img src="' + tagSourceUrl + '/images/popupArrow_border.png"></div>' + 
                '<textarea style="width: 122px; height: 80px; margin-top: 3px;">' + iframeCode + '</textarea></div>');
              var iframeDisplay = overlay.children().last();
              iframeDisplay.hide();

              overlay.append(
                '<div class="shareMenu"><div class="shareArrow">' + 
                '<img src="' + tagSourceUrl + '/images/popupArrow_border.png"></div><ul>' + 
                '<li><a target="_blank" href="' + tumblrUrl + '"><div class="socialIcon"><img src="' + tagSourceUrl + '/images/socialTumblr.png"></div><div class="socialName">Tumblr</div></a></li>' + 
                '<br><li class="embedLink" style="cursor: pointer"><div class="socialIcon"><img src="' + tagSourceUrl + '/images/socialEmbed.png"></div><div class="socialName">Embed</div></li>' + 
                '<br><a target="_blank" href="' + twitterUrl + '?url=' + encodeURIComponent(twitterDataUrl) + '&via=AscotProject"><li><div class="socialIcon"><img src="' + tagSourceUrl + '/images/socialTwitter.png"></div><div class="socialName">Twitter</div></a></li>' +
                '</ul></div>');
              var shareMenu = overlay.children().last();
              shareMenu.hide();
              var embedItem = shareMenu.children('ul').first().children('li.embedLink').first();
              embedItem.click(function() {
                iframeDisplay.toggle();
              });

              overlay.append(
                '<div class="ascot_overlay_image_menu">' +
                '<div><img style="cursor: pointer; height: 28px; width: 24px;" id="ascot_overlay_share_' + ascotId + '" src="' + tagSourceUrl + '/images/overlayOptions_share.png"></a></div>' +
                '<div><img id="ascot_upvote_' + ascotId + '" style="cursor: pointer; height: 24px; width: 24px;" src="' + tagSourceUrl + '/images/overlayOptions_heart_small.png"></a></div>' +
                '</div>');
              var imageMenu = overlay.children().last();
              var shareButton = imageMenu.children().first();
              shareButton.click(function(event) {
                event.preventDefault();
                iframeDisplay.hide();
                shareMenu.fadeToggle();
              });
              var upvoteButton = imageMenu.children().last();
              upvoteButton.click(function(event) {
                event.preventDefault();
                ascotUpvoteLook(ascotId);
              });

              if (data.hasUpvotedCookie) {
                $("#ascot_upvote_" + ascotId).attr('src', tagSourceUrl + '/images/overlayOptions_heart_small_opaque.png');
                $("#ascot_upvote_" + ascotId).css('cursor', '');
                $("#ascot_upvote_" + ascotId).css('opacity', '1');
              }
              
              if (json.source && json.source.length > 0) {
                if (json.source.indexOf('http://') != -1) {
                  overlay.append(
                      '<div class="ascot_overlay_source_tag">i<div class="ascot_overlay_source_url">' +
                      '<a href="' +
                      json.source + '\">' +
                      json.source +
                      '</a>' +
                      '</div>');
                } else {
                  overlay.append(
                      '<div class="ascot_overlay_source_tag">i<div class="ascot_overlay_source_url">' +
                      json.source +
                      '</div>');
                }
                var sourceTag = overlay.children().last();
                var sourceUrl = sourceTag.children().last();
                
                sourceTag.hover(function() {
                  sourceUrl.show(100, function(){});
                }, function() {
                  sourceUrl.hide(100, function(){});
                });
              }
              
              animateButton.click(function(event) {
                event.preventDefault();
                overlay.toggle("slide", { direction: "left" }, 500, function(){});
              });
              
              $.each(json.tags, function(i, tag) {
                var tagContainer = $("<div class='ascot_overlay_tag_container'></div>");
                var tagX;
                var tagY;
                if (height == json.size.height && width == json.size.width) {
                  // Image is default size - no need to scale tags
                  tagX = tag.position.x;
                  tagY = tag.position.y;
                } else {
                  // Image resized by client. Scale tag positions
                  tagX = (tag.position.x / json.size.width) * width;
                  tagY = (tag.position.y / json.size.height) * height;
                }
                tagContainer.css("left", tagX);
                tagContainer.css("top", tagY);
                tagContainer.appendTo(overlay);
                
                var tagName = $("<div class='ascot_overlay_tag_name'>" + tag.index + "</div>")
                tagName.appendTo(tagContainer);
                
                var tagDescription = $("<div class='ascot_overlay_tag_description'></div>");
                tagDescription.html(
                    "<b>" + tag.product.brand + "</b> " + tag.product.name +
                    "<br/>" +
                    (tag.product.buyLink.length > 0 ? "<a target='_blank' href=" + tag.product.buyLink + ">"+"Buy"+"</a><br/>" : "") +
                    (tag.product.price > 0 ? "$" + tag.product.price + "<br/>" : "") +
                    "<a target='_blank' href='" + tagSourceUrl + "/brand?v=" + encodeURIComponent(tag.product.brand) + "'>Other looks from " + tag.product.brand + "</a>");

                if (tagX > width / 2.0) {
                  tagDescription.css('right', '10px');
                } else {
                  tagDescription.css('left', '10px');
                }
                
                if (tagY > height / 2.0) {
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
            if (index + 1 < images.length) {
              ascotify(index + 1, images[index + 1]);
            }
          }
        });
      } else {
        if (index + 1 < images.length) {
          ascotify(index + 1, images[index + 1]);
        }
      }
    };

    if (images.length > 0) {
      ascotify(0, images[0]);
    }
  });
};





