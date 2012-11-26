$(document).ready(function (){

  $(".look").each(function(){
    var image = $(this).find("img.image")
    var container = $(this)

    image.load(function(){
      var imageSrc = image.attr('src');
      var animateButton = container.find("img.animateButton");
      var overlay = container.find(".overlay");

      
      var borderSize=5;
      $('.image').css('border', borderSize+'px'+'#c2c0c0 solid');
      $('.look').css('padding-left', borderSize+'px');

      // Display animate button
      animateButton.show()

      //Get list of tags for each image
      $.ajax({
        type: 'GET',
        url: '/tags.jsonp?url=' + encodeURIComponent(imageSrc),
        async: true,
        jsonpCallback: 'callback',
        contentType: 'application/jsonp',
        dataType: 'jsonp',
        success: function (json) {
          
          $.each(json.tags, function(i, e){
            console.log(e)

            // Create tag description and add to DOM
            var tag = $("<div class='item'>"+e.index+"</div>")
            tag.css("left", e.position.x+borderSize)
            tag.css("top", e.position.y+borderSize)
            overlay.append(tag)

            var itemDescription = $("<div class='item-description'></div>")
            itemDescription.html(e.product.name + "<br/><a target='_blank' href='" + 
              e.product.buy_link + "'>"+e.product.buyLink+"</a><br/>$" + e.product.price+"<br/><a href='/products/" + e.product._id + "/looks'>All Looks</a>");

            itemDescription.appendTo(tag)
            itemDescription.hide()

            tag.hover(function(){
              $(this).find(".item-description").show(100, function(){})
            },function(){
              $(this).find(".item-description").hide(100,function(){})
            });

            
          });

        },
        error: function (e) {console.log("failed to load tags")}
      });

      // Set width and heigh of container and overlay = to that of image
      var height = image.height();
      var width = image.width();

      container.height(height);
      container.width(width);
      overlay.height(height);
      overlay.width(width);

      // Bind animation layer
      animateButton.toggle(function () {overlay.show()}, function () {overlay.hide()});

      // Activate Ascot Layer
      animateButton.click();
    
    });
  });
});
