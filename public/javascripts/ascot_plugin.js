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

function AscotPlugin(tagSourceUrl) {
  this.getAscotHashParam = function(url) {
    if (url.lastIndexOf('#') == 0) {
      return null;
    } else {
      url = url.substring(url.lastIndexOf('#'));
    }

    var regex = new RegExp('#[.*&]?' + 'ascot' + '=' + '([^&;]+?)(&|#|\\?|$)');
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

  this.getAscotIdFromParentHref = function(image) {
    var href = image.parent().attr('href');
    var alt = image.attr('alt');
    if (href && href.toLowerCase().indexOf(tagSourceUrl) != -1) {
      var searchString = tagSourceUrl; 
      return href.toLowerCase().substr(
          href.indexOf(searchString) + searchString.length, '50f8bae560ad830943000004'.length);
    }
    return null;
  }

  this.htmlifyTags = function(look) {
    var ret = look.title;
    ret += (look.source.length > 0 ? "<br>Source: " + look.source : "");
    ret += "<br><br>";
    for (var i = 0; i < look.tags.length; ++i) {
      var tag = look.tags[i];
      ret += (i > 0 ? "<br>" : "") + (i + 1) + ". ";
      ret += "<a href='" + tag.product.buyLink + "'>" + 
             "<b>" + tag.product.brand + "</b> " + tag.product.name +
             "</a>"; 
    };
    return ret;
  };

  this.tumblrUrlGenerator = function(htmlifyTags, encodeURIComponent) {
    return function(look) {
      return  'http://www.tumblr.com/share/photo?' +
              'source=' + encodeURIComponent(look.url) +
              '&clickthru=' + encodeURIComponent('http://www.ascotproject.com/look/' + look._id) +
              '&caption=' + encodeURIComponent(htmlifyTags(look)) +
              '&tags=ascot';
    };
  };

  this.getTumblrShareUrl = this.tumblrUrlGenerator(this.htmlifyTags, encodeURIComponent);

  this.getTwitterUrl = function(url) {
    return "https://twitter.com/share?url=" + encodeURIComponent(url) + "&via=AscotProject";
  };

  this.getIframeCode = function(look) {
    return '<iframe src="http://www.ascotproject.com/look/' + look._id + '/iframe" width="' + look.size.width + '" height="' + look.size.height + '" frameborder="0" scrolling="no"></iframe>';
  };

  this.getFacebookUrl = function(url) {
    return 'https://www.facebook.com/dialog/send?app_id=169111373238111&link=' + encodeURIComponent(url) + '&redirect_uri=' + encodeURIComponent(url);
  };

  this.getPinterestUrl = function(image, url) {
    return '//pinterest.com/pin/create/button/?url=' + encodeURIComponent(url) + '&media=' + encodeURIComponent(image) + '&description=' + encodeURIComponent('From: ' + url);
  };

  this.getImageMap = function(look) {
    var ret = "<img src='" + look.taggedUrl + "' usemap='#ascot" + look._id + "'>";
    ret += "<map name='ascot" + look._id + "'>";
    for (var i = 0; i < look.tags.length; ++i) {
      if (look.tags[i].product.buyLink) {
        ret += "<area shape='circle' coords='" + look.tags[i].position.x + "," + look.tags[i].position.y + ",12' href='" + look.tags[i].product.buyLink + "' target='_blank'>";
      }
    }
    ret += "</map>";
    ret += "<br>";
    for (var i = 0; i < look.tags.length; ++i) {
      ret += (i + 1) + ". ";
      if (look.tags[i].product.buyLink) {
        ret += "<a href='" + look.tags[i].product.buyLink + "'>";
      }
      ret += "<b>" + look.tags[i].product.brand + "</b> ";
      ret += look.tags[i].product.name;
      if (look.tags[i].product.buyLink) {
        ret += "</a>";
      }
      ret += "<br>";
    }
    return ret;
  };
};

function AscotPluginUI(tagSourceUrl, myUrl) {
  this.constructTagContainer = function(overlay, tagContainer, defaultSize, actualSize, tag) {
    var tagX;
    var tagY;
    if (actualSize.height == defaultSize.height && actualSize.width == defaultSize.width) {
      // Image is default size - no need to scale tags
      tagX = tag.position.x;
      tagY = tag.position.y;
    } else {
      // Image resized by client. Scale tag positions
      tagX = (tag.position.x / defaultSize.width) * actualSize.width;
      tagY = (tag.position.y / defaultSize.height) * actualSize.height;
    }
    tagContainer.css("left", tagX);
    tagContainer.css("top", tagY);
    tagContainer.appendTo(overlay);

    return { x : tagX, y : tagY };
  };

  this.constructTagDescription = function(height, width, tagContainer, tagDescription, tag, tagPosition) {
    tagDescription.html(
        "<b>" +
        "<a id='ascot_overlay_link' target='_blank' href='" + tagSourceUrl + "/brand?v=" + encodeURIComponent(tag.product.brand) + "'>" +
        tag.product.brand + "</b></a> " + tag.product.name +
        "<br/>" +
        (tag.product.buyLink.length > 0 ? "<a id='ascot_overlay_buy_button' target='_blank' onclick='_gaq.push([\"ascot._trackEvent\", \"buyLinkClicked\", \"" + myUrl + "\", \"" + tag.product.buyLink + "\"])' href=" + tag.product.buyLink + ">"+"Buy"+"</a><br/>" : ""));

    var offset = 5;
    if (tagPosition.x > width / 2.0) {
      tagDescription.css('right', offset + 'px');
    } else {
      tagDescription.css('left', offset + 'px');
    }
                
    if (tagPosition.y > height / 2.0) {
      tagDescription.css('bottom', offset + 'px');
    } else {
      tagDescription.css('top', offset + 'px');
    }
                
    tagDescription.appendTo(tagContainer);
    tagDescription.hide();
  };

  this.handleUpvoteLook = function(jsonp, upvoteButton, ascotId) {
    jsonp(tagSourceUrl + '/upvote/' + ascotId + '.jsonp', function(json) {
      if (json.add) {
        upvoteButton.attr('src', tagSourceUrl + '/images/overlayOptions_heart_small_opaque.png');
        upvoteButton.css('cursor', 'pointer');
        upvoteButton.css('opacity', '1');
      } else if (json.remove) {
        upvoteButton.attr('src', tagSourceUrl + '/images/overlayOptions_heart_small.png');
        upvoteButton.css('cursor', 'pointer');
        upvoteButton.css('opacity', '0.6');
      } else {
        // Nothing to do here for now, just ignore
      }
    });
  };
}

function initAscotPlugin($, tagSourceUrl) {
  if (!window._gaq) {
    // Insert Google Analytics if it doesn't already exist
    window._gaq = [];
    
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  }
  
  _gaq.push(function() {
    _gaq.push(['ascot._setAccount', 'UA-36829509-1']);
    _gaq.push(['ascot._trackEvent', 'Plugin', 'loaded', $(location).attr('href')]);
  });

  var plugin = new AscotPlugin();
  var UI = new AscotPluginUI(tagSourceUrl, $(location).attr('href'));
  var jsonp = function(url, callback) {
    $.ajax({
      type: 'GET',
      url: url,
      async: true,
      jsonpCallback: 'callback',
      contentType: 'application/jsonp',
      dataType: 'jsonp',
      success : function(json) {
        callback(json);
      }
    });
  };

  var ascotUpvoteLook = function(upvoteButton, ascotId) {
    UI.handleUpvoteLook(jsonp, upvoteButton, ascotId);
  };
  
  var makeOverlay = function(image, ascotId, url, json) {
    if (json && json.look && json.look.tags) {
      var data = json;
      json = json.look;
      
      _gaq.push(['ascot._trackEvent', 'lookLoaded', ascotId, $(location).attr('href')]);

      var tumblrUrl = plugin.getTumblrShareUrl(json);

      var twitterUrl = plugin.getTwitterUrl("http://www.ascotproject.com/look/" + json._id);

      var iframeCode = plugin.getIframeCode(json);

      var facebookUrl = plugin.getFacebookUrl('http://www.ascotproject.com/look/' + json._id);
      
      var pinterestUrl = plugin.getPinterestUrl(json.url, 'http://www.ascotproject.com/look/' + json._id);

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
          '<textarea onclick="_gaq.push([\'ascot._trackEvent\', \'embedClick\', \'' + json._id + '\', \'' + $(location).attr('href') + '\']);" style="width: 142px; height: 110px; margin-top: 3px;">' + iframeCode + '</textarea></div>');
      var iframeDisplay = menuWrapper.children().last();
      iframeDisplay.hide();
      iframeDisplay.click(function(event) {
        event.preventDefault();
      });

      menuWrapper.append(
          '<div class="ascot_overlay_share_menu" style="right: 172px; width: 152px; top: 65px; height:150px"><div class="ascot_overlay_share_arrow" style="right: -20px; top: 120px">' +
          '<img id="ascot_overlay_share_arrow" src="' + tagSourceUrl + '/images/popupArrow_border.png"></div>' + 
          '<p id="ascot_overlay_embed_instruct">Copy code & paste in body of your site or email</p>'+
          '<textarea onclick="_gaq.push([\'ascot._trackEvent\', \'htmlClick\', \'' + json._id + '\', \'' + $(location).attr('href') + '\']);" style="width: 142px; height: 110px; margin-top: 3px;">' + plugin.getImageMap(json) + '</textarea></div>');
      var htmlCodeDisplay = menuWrapper.children().last();
      htmlCodeDisplay.hide();
      htmlCodeDisplay.click(function(event) {
        event.preventDefault();
      });

      menuWrapper.append(
          '<div class="ascot_overlay_share_menu"><div class="ascot_overlay_share_arrow">' + 
          '<img id="ascot_overlay_share_arrow" src="' + tagSourceUrl + '/images/popupArrow_border.png"></div><ul id="ascot_overlay_share_list">' + 
          '<li id="ascot_overlay_share"><a target="_blank" onclick="_gaq.push([\'ascot._trackEvent\', \'tumblr\', \'' + json._id + '\', \'' + $(location).attr('href') + '\'])" href="' + tumblrUrl + '"><div class="ascot_overlay_social_icon"><img id="ascot_overlay_social" src="' + tagSourceUrl + '/images/socialTumblr.png"></div><div class="ascot_overlay_social_name">Tumblr</div></a></li>' + 
          '<br><li id="ascot_overlay_share" class="embedLink" style="cursor: pointer"><div class="ascot_overlay_social_icon"><img id="ascot_overlay_social" src="' + tagSourceUrl + '/images/socialEmbed.png"></div><div class="ascot_overlay_social_name">Embed</div></li>' + 
          '<br><a target="_blank" onclick="_gaq.push([\'ascot._trackEvent\', \'twitter\', \'' + json._id + '\', \'' + $(location).attr('href') + '\'])" href="' + twitterUrl + '"><li id="ascot_overlay_share"><div class="ascot_overlay_social_icon"><img id="ascot_overlay_social" src="' + tagSourceUrl + '/images/socialTwitter.png"></div><div class="ascot_overlay_social_name">Twitter</div></li></a>' +
          '<br><a target="_blank" onclick="_gaq.push([\'ascot._trackEvent\', \'facebook\', \'' + json._id + '\', \'' + $(location).attr('href') + '\'])" href="' + facebookUrl + '"><li id="ascot_overlay_share"><div class="ascot_overlay_social_icon"><img id="ascot_overlay_social" src="' + tagSourceUrl + '/images/socialEmbed_facebook.png"></div><div class="ascot_overlay_social_name">Facebook</div></li></a>' +
          '<br><a target="_blank" onclick="_gaq.push([\'ascot._trackEvent\', \'pinterest\', \'' + json._id + '\', \'' + $(location).attr('href') + '\']);" href="' + pinterestUrl + '"><li id="ascot_overlay_share"><div class="ascot_overlay_social_icon"><img id="ascot_overlay_social" src="' + tagSourceUrl + '/images/socialEmbed_pinterest.png"></div><div class="ascot_overlay_social_name">Pinterest</div></li></a>' +
          '<br><li id="ascot_overlay_share" class="embedLink" style="cursor: pointer"><div class="ascot_overlay_social_icon"><img id="ascot_overlay_social" src="' + tagSourceUrl + '/images/socialEmail.png"></div><div class="ascot_overlay_social_name">Email</div></li>' + 
          '</ul></div>');
      var shareMenu = menuWrapper.children().last();
      shareMenu.hide();
      var embedItem = shareMenu.children('ul').first().children('li.embedLink').first();
      embedItem.click(function(event) {
        event.preventDefault();
        iframeDisplay.toggle();
      });
      var emailItem = shareMenu.children('ul').first().children('li.embedLink').last();
      emailItem.click(function(event) {
        event.preventDefault();
        htmlCodeDisplay.toggle();
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
        htmlCodeDisplay.hide();
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
        $(upvoteButton).css('cursor', 'pointer');
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
        var tagPosition = UI.constructTagContainer(overlay, tagContainer, json.size, { height : height, width : width }, tag);
                
        var tagName =
            $("<div class='ascot_overlay_tag_name'>" + tag.index + "</div>");
        tagName.appendTo(tagContainer);
        if (smallImage) {
          tagName.css('transform', 'scale(' + smallScaleFactor + ',' + smallScaleFactor + ')');
        }
                
        var tagDescription = $("<div class='ascot_overlay_tag_description'></div>");
        UI.constructTagDescription(height, width, tagContainer, tagDescription, tag, tagPosition);
        if (smallImage) {
          tagDescription.css('transform', 'scale(' + smallScaleFactor + ',' + smallScaleFactor + ')');
        }
                
        tagContainer.hover(function() {
          tagContainer.css('z-index', 5);
          tagDescription.show(100, function(){});
        },function(){
          tagContainer.css('z-index', 0);
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
      
    var ascotId = plugin.getAscotHashParam(url);

    // This is really only useful for Tumblr and other places which insist on
    // only showing images stored on their servers. On our end we can just use
    // the #ascot notation, so just hardcode the ascotproject.com stuff for now
    if (ascotId == null && image.parent()) {
      ascotId = plugin.getAscotIdFromParentHref(image);
    }

    if (ascotId != null) {
      jsonp(
          tagSourceUrl + '/tags.jsonp?id=' + encodeURIComponent(ascotId),
          function (json) {
            // Now that we know that our jsonp call is done, we can wait for our
            // image to load to make our overlay, and then go to the next image in
            // our 'queue'
            image.imagesLoaded(function() {
              makeOverlay(image, ascotId, url, json);
            });

            if (index + 1 < images.length) {
              ascotify(index + 1, images[index + 1]);
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