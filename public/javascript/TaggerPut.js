$(document).ready(function() {
  $("#json_content_submit").click(function() {
    alert('1');
    TaggerPut($("#myKey").val(), $("#myId").val());
  });
});

var TaggerPut = function(key, look) {
    alert(JSON.stringify($.parseJSON($("#json_content").val())));
  $.ajax({
    type : "PUT",
    url : "/tagger/" + key + "/" + look,
    contentType: "application/json",
    data : $("#json_content").val(),
    success : function() {
      alert("Success");
    }, failure: function() {
      alert("FAIL");
    }
  });
};
