
$(document).ready(function() {
  $("img[adjust_ascot_wrapper]").each(function(i, el) {
    $(el).imagesLoaded(function() {
      $(el).parent().css('width', $(el).width() + 'px');
      $(el).parent().css('height', $(el).height() + 'px');
    });
  });
});

