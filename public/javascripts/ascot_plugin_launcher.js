/*
 *  ascot_plugin_launcher.js
 *
 *  Created on: January 11, 2012
 *      Author: Valeri Karpov
 *
 *  Set up the current page to run the Ascot plugin - make sure jQuery,
 *  jQuery UI, and stylesheets are all there. This is the preferred method
 *  for embedding the Ascot plugin and requires no outside files.
 *
 *  Essentially, this file performs the equivalent of:
 *  
 *  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
 *  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
 *  <script type="text/javascript" src="https://www.ascotproject.com/vendor/javascripts/jquery.imagesloaded.js"></script>
 *  <link rel='stylesheet' href='/stylesheets/ascot_plugin.css'>
 *  <script type="text/javascript" src="/javascripts/ascot_plugin.js"></script>
 *
 *  in your HTML header, with the caveat that it checks if jQuery UI and jQuery
 *  are already there. 
 *
 */

(function() {
  var loadScript = function(src, callback) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.onreadystatechange = function() {
      if (this.readyState == 'complete' || this.readyState == 'loaded') {
        callback();
      }
    }
    
    script.onload = callback;
    script.src = src;
    head.appendChild(script);
  };
  
  var loadStylesheet = function(src, callback) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = src;
    
    head.appendChild(link);
    callback();
  };

  var checkJQuery = function(callback) {
    if (typeof jQuery !== 'undefined') {
      callback();
    } else {
      loadScript(
          'https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js',
          callback);
    }
  };
  
  var checkJQueryUI = function(callback) {
    if (jQuery.ui) {
      callback();
    } else {
      loadScript(
        'https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js',
        callback);
    }
  };
  
  var checkJQueryImagesLoaded = function(callback) {
    if (jQuery.imagesLoaded) {
      callback();
    } else {
      loadScript(
        'http://www.ascotproject.com/vendor/javascripts/jquery.imagesloaded.js',
        callback);
    }
  };
  
  var loadAscotStylesheets = function(url, callback) {
    loadStylesheet(
        url + '/stylesheets/ascot_plugin.css',
        callback);
  };
  
  var loadAscotPlugin = function(url, callback) {
    loadScript(
        url + '/javascripts/ascot_plugin.js',
        callback);
  };

  var url = 'http://www.ascotproject.com';
  checkJQuery(function() {
    checkJQueryUI(function() {
      checkJQueryImagesLoaded(function() {
        loadAscotStylesheets(url, function() {
          loadAscotPlugin(url, function() {
            initAscotPlugin(jQuery, url);
          });
        });
      });
    });
  });
})();
