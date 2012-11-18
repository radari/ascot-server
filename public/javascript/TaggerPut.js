$(document).ready(function() {

  var tagData = []

  var container = $('#look')
  var image = $('img.uploadedImg')
  

  image.load(function(){

    var tag = {}

    var height = image.height()
    var width = image.width()

    console.log(height)

    container.height(height)
    container.width(width)

    image.on("click", function(e){
      console.log(e)

      var overlay = container.find('#overlay')

      tag.position = {x: e.offsetX, y: e.offsetY},
      tag.index = tagData.length + 1
      
      console.log(tag)

      overlay.show()

      overlay.css('left', (e.offsetX+10) + "px")
      overlay.css('top', e.offsetY + "px")

    });

    // add new tag
    $("#add_tag").on("click", function(){
      var productInput = $("#productSearch")
      tag.product = {id: productInput.val()}
      productInput.val("")

      tagData.push(tag)

      var newTag = $("<div class='item'></div>")
      newTag.text(tag.product.id)
      newTag.css('left', tag.position.x - 10)
      newTag.css('top', tag.position.y)

      var t = newTag.css('z-index')
      newTag.css('z-index', t+1)
      container.append(newTag)


    });

  });




  // Submit tagData
  $("#json_content_submit").click(function() {
    TaggerPut($("#myKey").val(), $("#myId").val(), tagData);
  });
});

var TaggerPut = function(key, look, data) {
   
  console.log(JSON.stringify($.parseJSON($("#json_content").val())));
  $.ajax({
    type : "PUT",
    url : "/tagger/" + key + "/" + look,
    contentType: "application/json",
    data : data,
    success : function() {}, 
    failure: function() {}
  });
};

function doSomething(e) {
  var posx = 0;
  var posy = 0;
  if (!e) var e = window.event;
  if (e.pageX || e.pageY)   {
    posx = e.pageX;
    posy = e.pageY;
  }
  else if (e.clientX || e.clientY)  {
    posx = e.clientX + document.body.scrollLeft
      + document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop
      + document.documentElement.scrollTop;
  }
  // posx and posy contain the mouse position relative to the document
  // Do something with this information
}
