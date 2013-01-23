$(document).ready(function (){

  $(".look").each(function(){
    var image = $(this).find("img.image")
    var container = $(this)

    image.load(function(){

      var height = image.height();
      var width = image.width();

      // Set width and heigh of container and overlay = to that of image
      container.height(height);
      container.width(width);
    
    });
  });
});
