$(document).ready(function (){

  $(".look").each(function(){
    var image = $(this).find("img.image")
    var container = $(this)

    image.load(function(){
      var imageSrc = image.attr('src');
      var animateButton = container.find("div.animateButton");
      var overlay = container.find("div.overlay");
      var ascotId = image.attr('ascot');

      // Display animate button
      animateButton.show()

      //Get list of tags for each image
      $.ajax({
        type: 'GET',
        url: '/tags.jsonp?id=' + encodeURIComponent(ascotId),
        async: true,
        jsonpCallback: 'callback',
        contentType: 'application/jsonp',
        dataType: 'jsonp',
        success: function (json) {
          
          $.each(json.tags, function(i, e){

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
            tagDescription.html(e.product.name + "<br/><a target='_blank' href="+ e.product.buyLink + 
             ">"+"Buy"+"</a><br/>$" + e.product.price+"<br/><a href='/brand?v=" + encodeURIComponent(e.product.brand) + "'>" + e.product.brand + "</a>");

            tagDescription.appendTo(tagContainer)
            tagDescription.hide()

            tagContainer.hover(function(){
              $(this).find(".tag-description").show(100,function(){})
            },function(){
              $(this).find(".tag-description").hide(100,function(){})
            });

            $(".sourceTag").hover(function(){
              $(this).find(".sourceUrl").show(100,function(){})
            },function(){
              $(this).find(".sourceUrl").hide(100,function(){})
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

      var iframe_code = $(".iframe_code")
      if(iframe_code.length > 0){
        i = iframe_code.first()
        i.val("<iframe src='http://"+location.host+"/look/"+i.attr("data-url")+"/iframe'  width='"+width+"' height='"+height+"' frameborder= '0'></iframe>")
      }
    
    });
  });
});
