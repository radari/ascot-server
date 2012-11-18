
$(document).ready(function() {
  $("img[ascot_key][ascot]").each(function(i, el) {
    $(el).load(function() {
      $.ajax({
        type : 'GET',
        url : '/tags.jsonp?url=' + encodeURIComponent($(el).attr("src")),
        async : true,
        success : function(json) {
          $("#save_button").click(function() {
            TaggerPut($(el).attr("ascot_key"), $(el).attr("ascot"), json.tags);
          });
          var editting = false;
          $(el).wrap('<div style="position: relative; width: ' + $(el).width() + 'px; height: ' + $(el).height() + 'px" />');
          for (var i = 0; i < json.tags.length; ++i) {
            $(el).parent().append('<div class="item" style="position: absolute; left: '
                + (json.tags[i].position.x) + 'px; top: '
                + (json.tags[i].position.y) + 'px">'
                + (json.tags[i].index) + '</div>');
          }
          $(el).parent().click(function(event) {
            if (editting) {
              return;
            }
            editting = true;
            $(el).parent().append('<div class="item" style="position: absolute; left: '
                + (event.pageX - $(el).parent().offset().left) + 'px; top: '
                + (event.pageY - $(el).parent().offset().top) + 'px">'
                + (json.tags.length + 1) + '</div>');
            $("#overlay").css('left', (event.pageX - $(el).parent().offset().left + 20) + 'px');
            $("#overlay").css('top', (event.pageY - $(el).parent().offset().top + 30) + 'px');
            $("#overlay").show();
            var auto = $("#productSearch").autocomplete({
              serviceUrl : '/products.json',
              minChars : 2,
              delimiter : /(,|;)\s*/, // regex or character
              zIndex : 1000,
              deferRequestBy : 0,
              onSelect : function(str, product) {
                //alert("You selected " + JSON.stringify(product));
                json.tags.push({ index : json.tags.length + 1,
                                 position : { x : (event.pageX - $(el).parent().offset().left),
                                              y : (event.pageY - $(el).parent().offset().top) },
                                 product : product._id });
                $("#productSearch").val('');
                $("#overlay").hide();
                $(".autocomplete").hide();
                $("#json_content").val(JSON.stringify(json));
                editting = false;
              }
            }).enable();
            $("#productSearch").focus();
          });
        },
        error : function(e) {
        }
      });
    });
  });
});

var TaggerPut = function(key, look, data) {
  $.ajax({
    type : "PUT",
    url : "/tagger/" + key + "/" + look,
    contentType: "application/json",
    data : JSON.stringify(data),
    success : function() {
      $(location).attr('href', '/look/' + look);
    }, 
    failure: function() {}
  });
};
