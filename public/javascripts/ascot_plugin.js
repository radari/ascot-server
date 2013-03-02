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

  window.ascotUpvoteLook = function(upvoteButton, ascotId) {
    $.ajax({
      type: 'GET',
      url: tagSourceUrl + '/upvote/' + ascotId + '.jsonp',
      async: true,
      jsonpCallback: 'callback',
      contentType: 'application/jsonp',
      dataType: 'jsonp',
      success : function(json) {
        if (!json.error) {
          upvoteButton.attr('src', tagSourceUrl + '/images/overlayOptions_heart_small_opaque.png');
          upvoteButton.css('cursor', '');
          upvoteButton.css('opacity', '1');
        } else {
          // Nothing to do here for now, just ignore
        }
      }
    });
  };
  
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
  
  var htmlifyTagsForPinterest = function(look) {
    var ret = look.title;
    ret += (look.source.length > 0 ? " / Source: " + look.source : "");
    for (var i = 0; i < look.tags.length; ++i) {
      var tag = look.tags[i];
      ret += " / ";
      ret += tag.product.brand + " " + tag.product.name + " " +
             tag.product.buyLink; 
    };
    return ret;
  }
  
  var makeOverlay = function(image, ascotId, url, json) {
    if (json && json.look && json.look.tags) {
      var data = json;
      json = json.look;

      var tumblrUrl = 'http://www.tumblr.com/share/photo?' +
                      'source=' + encodeURIComponent(json.url) +
                      '&clickthru=' + encodeURIComponent('http://www.ascotproject.com/look/' + json._id) +
                      '&caption=' + encodeURIComponent(htmlifyTags(json)) +
                      '&tags=ascot';

      var twitterUrl = "https://twitter.com/share"
      var twitterDataUrl = "http://www.ascotproject.com/look/" + json._id;

      var iframeCode = '<iframe src="http://www.ascotproject.com/look/' + json._id + '/iframe" width="' + json.size.width + '" height="' + json.size.height + '" frameborder="0"></iframe>';

      var facebookUrl = 'https://www.facebook.com/dialog/send?app_id=169111373238111&link=' + encodeURIComponent('http://www.ascotproject.com/look/' + json._id) + '&redirect_uri=' + encodeURIComponent('http://www.ascotproject.com/look/' + json._id);
      
      var pinterestUrl = '//pinterest.com/pin/create/button/?url=' + encodeURIComponent('http://www.ascotproject.com/look/' + json._id) + '&media=' + encodeURIComponent(json.url) + '&description=' + encodeURIComponent('From: http://www.ascotproject.com/look/' + json._id);

      var height = image.height();
      var width = image.width();
              
      var smallImage = height < 300 && width < 300;
      var smallScaleFactor = 0.75;
            
      image.wrap('<div class="ascot_overlay_look" />');
      var wrapper = image.parent();
      wrapper.css('width', image.width() + 'px');
      wrapper.css('height', image.height() + 'px');

      image.css('position', 'absolute');
      image.css('top', '0px');
      image.css('left', '0px');
              
      wrapper.append('<div class="ascot_overlay_animate_button"></div>');
      var animateButton = wrapper.children().last();
      if (smallImage) {
        animateButton.css('transform', 'scale(' + smallScaleFactor + ',' + smallScaleFactor + ')');
        animateButton.css('margin', '0px');
      }
              
      wrapper.append('<div class="ascot_overlay"></div>');
      var overlay = wrapper.children().last();
      overlay.css('width', image.width() + 'px');
      overlay.css('height', image.height() + 'px');
      overlay.append('<div class="ascot_overlay_menu_wrapper"></div>');
      var menuWrapper = overlay.children().last();
              
      menuWrapper.append(
          '<div class="ascot_overlay_share_menu" style="right: 172px; width: 152px; top: 35px; height:150px"><div class="ascot_overlay_share_arrow" style="right: -20px;">' +
          '<img id="ascot_overlay_share_arrow" src="' + tagSourceUrl + '/images/popupArrow_border.png"></div>' + 
          '<p id="ascot_overlay_embed_instruct">Copy code & paste in body of your site</p>'+
          '<textarea style="width: 142px; height: 110px; margin-top: 3px;">' + iframeCode + '</textarea></div>');
      var iframeDisplay = menuWrapper.children().last();
      iframeDisplay.hide();
      iframeDisplay.click(function(event) {
        event.preventDefault();
      });

      menuWrapper.append(
          '<div class="ascot_overlay_share_menu"><div class="ascot_overlay_share_arrow">' + 
          '<img id="ascot_overlay_share_arrow" src="' + tagSourceUrl + '/images/popupArrow_border.png"></div><ul id="ascot_overlay_share_list">' + 
          '<li><a target="_blank" href="' + tumblrUrl + '"><div class="ascot_overlay_social_icon"><img id="ascot_overlay_social" src="' + tagSourceUrl + '/images/socialTumblr.png"></div><div class="ascot_overlay_social_name">Tumblr</div></a></li>' + 
          '<br><li class="embedLink" style="cursor: pointer"><div class="ascot_overlay_social_icon"><img id="ascot_overlay_social" src="' + tagSourceUrl + '/images/socialEmbed.png"></div><div class="ascot_overlay_social_name">Embed</div></li>' + 
          '<br><a target="_blank" href="' + twitterUrl + '?url=' + encodeURIComponent(twitterDataUrl) + '&via=AscotProject"><li><div class="ascot_overlay_social_icon"><img id="ascot_overlay_social" src="' + tagSourceUrl + '/images/socialTwitter.png"></div><div class="ascot_overlay_social_name">Twitter</div></li></a>' +
          '<br><a target="_blank" href="' + facebookUrl + '"><li><div class="ascot_overlay_social_icon"><img id="ascot_overlay_social" src="' + tagSourceUrl + '/images/socialEmbed_facebook.png"></div><div class="ascot_overlay_social_name">Facebook</div></li></a>' +
          '<br><a target="_blank" href="' + pinterestUrl + '"><li><div class="ascot_overlay_social_icon"><img id="ascot_overlay_social" src="' + tagSourceUrl + '/images/socialEmbed_pinterest.png"></div><div class="ascot_overlay_social_name">Pinterest</div></li></a>' +
          '</ul></div>');
      var shareMenu = menuWrapper.children().last();
      shareMenu.hide();
      var embedItem = shareMenu.children('ul').first().children('li.embedLink').first();
      embedItem.click(function(event) {
        event.preventDefault();
        iframeDisplay.toggle();
      });

      menuWrapper.append(
          '<div class="ascot_overlay_image_menu">' +
          '<div><img style="cursor: pointer; height: 28px; width: 24px;" id="ascot_overlay_menu_item" src="' + tagSourceUrl + '/images/overlayOptions_share.png"></a></div>' +
          '<div><img id="ascot_overlay_menu_item" style="cursor: pointer; height: 24px; width: 24px;" src="' + tagSourceUrl + '/images/overlayOptions_heart_small.png"></a></div>' +
          '</div>');
      var imageMenu = menuWrapper.children().last();
      var shareButton = imageMenu.children().first();
      shareButton.click(function(event) {
        event.preventDefault();
        iframeDisplay.hide();
        shareMenu.fadeToggle();
      });
      var upvoteButton = imageMenu.children().last().children().first();
      upvoteButton.click(function(event) {
        event.preventDefault();
        ascotUpvoteLook(upvoteButton, ascotId);
      });
      
      if (smallImage) {
        menuWrapper.css('transform', 'scale(' + smallScaleFactor + ',' + smallScaleFactor + ')');
      }

      if (data.hasUpvotedCookie) {
        $(upvoteButton).attr('src', tagSourceUrl + '/images/overlayOptions_heart_small_opaque.png');
        $(upvoteButton).css('cursor', '');
        $(upvoteButton).css('opacity', '1');
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
                
        if (smallImage) {
          sourceTag.css('transform', 'scale(' + smallScaleFactor + ',' + smallScaleFactor + ')');
                  
          sourceUrl.css('transform', 'scale(' + smallScaleFactor + ',' + smallScaleFactor + ')');

          sourceUrl.css('left', '-5px');
        }

        sourceTag.hover(function() {
          sourceUrl.show(100, function(){});
        }, function() {
          sourceUrl.hide(100, function(){});
        }, 250);
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
                
        var tagName =
            $("<div class='ascot_overlay_tag_name'>" + tag.index + "</div>");
        tagName.appendTo(tagContainer);
        if (smallImage) {
          tagName.css('transform', 'scale(' + smallScaleFactor + ',' + smallScaleFactor + ')');
        }
                
        var tagDescription = $("<div class='ascot_overlay_tag_description'></div>");
        tagDescription.html(
            "<b>" +
            "<a id='ascot_overlay_link' target='_blank' href='" + tagSourceUrl + "/brand?v=" + encodeURIComponent(tag.product.brand) + "'>" +
            tag.product.brand + "</b></a> " + tag.product.name +
            "<br/>" +
            (tag.product.buyLink.length > 0 ? "<a id='ascot_overlay_buy_button' target='_blank' href=" + tag.product.buyLink + ">"+"Buy"+"</a><br/>" : ""));
            //(tag.product.price > 0 ? "$" + tag.product.price + "<br/>" : ""));
        if (smallImage) {
          tagDescription.css('transform', 'scale(' + smallScaleFactor + ',' + smallScaleFactor + ')');
        }

        var offset = smallImage ? 0 : 10;
        if (tagX > width / 2.0) {
          tagDescription.css('right', offset + 'px');
        } else {
          tagDescription.css('left', offset + 'px');
        }
                
        if (tagY > height / 2.0) {
          tagDescription.css('bottom', offset + 'px');
        } else {
          tagDescription.css('top', offset + 'px');
        }
                
        tagDescription.appendTo(tagContainer);
        tagDescription.hide();
                
        tagContainer.hover(function() {
          tagDescription.show(100, function(){});
        },function(){
          tagDescription.hide(100, function(){});
        }, 250);
      });  
    }
  };
   
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
        var searchString = 'ascotproject.com/look/'; 
        ascotId =
            href.toLowerCase().substr(
                href.indexOf(searchString) + searchString.length,
                '50f8bae560ad830943000004'.length);
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
          // Now that we know that our jsonp call is done, we can wait for our
          // image to load to make our overlay, and then go to the next image in
          // our 'queue'
          image.imagesLoaded(function() {
            makeOverlay(image, ascotId, url, json);
          });
            
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
};





