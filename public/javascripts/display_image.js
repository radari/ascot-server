$(document).ready(function (){

  $(".look").each(function(){
    var image = $(this).find("img.image")
    var container = $(this)

    image.load(function(){
      var imageSrc = image.attr('src');
      var animateButton = container.find("div.animateButton");
      var overlay = container.find("div.overlay");

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
            var tagContainer = $("<div class='tag-container'></div>")
            tagContainer.css("left", e.position.x)
            tagContainer.css("top", e.position.y)
            tagContainer.appendTo(overlay)


            //Create Tag Name
            var tagName = $("<div class='tag-name'>"+e.index+"</div>")
            tagName.appendTo(tagContainer)


            // Create Tag Description
            var tagDescription = $("<div class='tag-description'></div>")
            tagDescription.html(e.product.name + "<br/><a target='_blank' href='" + 
              e.product.buy_link + "'>"+e.product.buyLink+"</a><br/>$" + e.product.price+"<br/><a href='/products/" + e.product._id + "/looks'>All Looks</a>");

            tagDescription.appendTo(tagContainer)
            tagDescription.hide()

            tagContainer.hover(function(){
              $(this).find(".tag-description").show(100,function(){})
            },function(){
              $(this).find(".tag-description").hide(100,function(){})
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
      
      animateButton.click(function(){
        overlay.toggle("slide", {direction: "left"}, 500, function(){});
      });

      // animateButton.toggle(function () {       
        
      //   overlay.show(1000, function(){
        
      //   })

      // }, function () {
      //   overlay.hide(1000)
      // });

      // Activate Ascot Layer
      animateButton.click();
    
    });
  });
});
