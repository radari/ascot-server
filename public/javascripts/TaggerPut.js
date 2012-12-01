var DragManager = function(container) {
  var x = 0;
  var y = 0;
  this.el = null;
  this.model = null;
  this.updateXY = function(xx, yy) {
    x = Math.min(Math.max(0, xx), container.width());
    y = Math.min(Math.max(0, yy), container.height());
    if (this.el != null) {
      this.el.css('left', x + 'px');
      this.el.css('top', y + 'px');
      this.model.position.x = x;
      this.model.position.y = y;
    }
  };
  this.setDraggingElement = function(element, model) {
    this.el = element;
    this.model = model;
  };
  this.isDragActive = function() {
    return this.el != null;
  };
};

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

          var dragManager = new DragManager($(el).parent());
          $(el).parent().mousemove(function(event) {
            dragManager.updateXY(
                (event.pageX - $(el).parent().offset().left - 8),
                (event.pageY - $(el).parent().offset().top - 8));
          });

          var bindTagCallbacks = function(view, model) {
            view.mousedown(function(event) {
              dragManager.setDraggingElement(view, model);
            });
            view.mouseup(function(event) {
              dragManager.setDraggingElement(null, null);
              if (editting) {
                $("#overlay").css('left', (parseInt(tag.css('left')) + 20) + 'px');
                $("#overlay").css('top', (parseInt(tag.css('top')) + 30) + 'px');
              }
            });
            view.click(function(event) {
              event.stopPropagation();
            });
          };

          for (var i = 0; i < json.tags.length; ++i) {
            $(el).parent().append('<div class="item" style="position: absolute; left: '
                + (json.tags[i].position.x) + 'px; top: '
                + (json.tags[i].position.y) + 'px">'
                + (json.tags[i].index) + '</div>');
            var tag = $($(el).parent().children().last());
            bindTagCallbacks(tag, json.tags[i]);
          }
          $(el).parent().click(function(event) {
            if (editting || dragManager.isDragActive()) {
              return;
            }
            editting = true;
            $(el).parent().append('<div class="item" style="position: absolute; left: '
                + (event.pageX - $(el).parent().offset().left - 8) + 'px; top: '
                + (event.pageY - $(el).parent().offset().top - 8) + 'px">'
                + (json.tags.length + 1) + '</div>');

            var tag = $($(el).parent().children().last());
            tag.mousedown(function() {
              dragManager.setDraggingElement(tag);
            });
            tag.mouseup(function() {
              dragManager.setDraggingElement(null);
              if (editting) {
                $("#overlay").css('left', (parseInt(tag.css('left')) + 20) + 'px');
                $("#overlay").css('top', (parseInt(tag.css('top')) + 30) + 'px');
              }
            });

            $("#overlay").css('left', (event.pageX - $(el).parent().offset().left + 12) + 'px');
            $("#overlay").css('top', (event.pageY - $(el).parent().offset().top + 22) + 'px');
            $("#overlay").show();
            var auto = $("#productSearch").autocomplete({
              serviceUrl : '/products.json',
              minChars : 2,
              delimiter : /(,|;)\s*/, // regex or character
              zIndex : 1000,
              deferRequestBy : 0,
              onSelect : function(str, product) {
                json.tags.push({ index : json.tags.length + 1,
                                 position : { x : (event.pageX - $(el).parent().offset().left - 8),
                                              y : (event.pageY - $(el).parent().offset().top - 8) },
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
