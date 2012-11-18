$(document).ready(function() {

  var tagData = []


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
