
$(document).ready(function (){

  $(".look").each(function(){
    var image = $(this).find("img.image")
    var container = $(this)

    image.load(function(){
      var imageSrc = image.attr('src');
      var animateButton = container.find("img.animate");
      var overlay = container.find(".overlay");
      var canvas = container.find("canvas.canvas")
      var tags = $(this).find(".tags");

      // Get list of tags for each image
      // $.ajax({
      //   type: 'GET',
      //   url: 'http://ascotproject.com:3000/tags.jsonp?url=' + encodeURIComponent(imageSrc),
      //   async: true,
      //   jsonpCallback: 'callback',
      //   contentType: 'application/json',
      //   dataType: 'jsonp',
      //   success: function (json) {
      //     console.log('http://ascotproject.com:3000/tags.jsonp?url=' + encodeURIComponent(imageSrc));
      //     console.log('Displaying for url+ ' + imageSrc + ' with tags ' + JSON.stringify(json));

      //     // create and place tags


      //   },
      //   error: function (e) {}
      // });

      var height = image.height();
      var width = image.width();

      container.height(height);
      container.width(width);

      overlay.height(height);
      overlay.width(width);

      canvas.height(height)
      canvas.width(width)

      console.log("Height: " + height + "   Width: " + width);


      var date = new Date();
      var time = date.getTime();

      animateButton.toggle(function () {
        canvas.height(height)
        canvas.width(width)

        date = new Date();
        time = date.getTime();

        // disable button while animation is running 
        animateButton.fadeOut(200);
        animateDown(canvas[0], -200, time);
        animateButton.fadeIn(200);


      }, function () {

        canvas.height(height)
        canvas.width(width)

        date = new Date();
        time = date.getTime();

        animateButton.fadeOut(200);
        animateUp(canvas[0], canvas.height(), time);
        animateButton.fadeIn(200);

      });
    });
  });
});


function animateDown(canvas, startY, lastTime) {
  console.log("here")
  window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();
  

  var context = canvas.getContext('2d');
  var date = new Date();
  var time = date.getTime();
  var timeDiff = time - lastTime;

  //how fast our animation runs
  var speed = 300;
  var linearDistEachFrame = speed * timeDiff / 1000;
  var marqueeSize = 180; //why is this called marqueeSize? 

  //size of the curl shadow, the main rectangle, and the top edge shadow 
  var mainRect = 40;
  var curlShadow = 3;
  var topEdgeSize = 2;

  // Establish the leading edge of the scroll
  var coefficient = (canvas.height - startY) / (canvas.height);
  var leadingEdge = startY + marqueeSize * coefficient;

  // Clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  //draw the overlay
  context.beginPath();
  context.rect(0, 0, canvas.width, startY);
  var grd = context.createLinearGradient(canvas.width, 0, canvas.width, startY);
  grd.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
  context.fillStyle = grd;
  context.fill();

  //draw main rect 
  var grd = context.createLinearGradient(canvas.width, leadingEdge, canvas.width, leadingEdge - mainRect);
  grd.addColorStop(1.00, 'rgba(255, 255, 255, 0.16)');
  grd.addColorStop(0.73, 'rgba(255, 255, 255, 0.16)');
  grd.addColorStop(0.43, 'rgba(226, 226, 226, 0.4)');
  grd.addColorStop(0.20, 'rgba(255, 255, 255, 0.16)');
  context.beginPath();
  context.rect(0, leadingEdge, canvas.width, startY - leadingEdge);
  context.fillStyle = grd;
  context.strokeStyle = 'rgba(000, 000, 000, 0.06)';
  context.fill();
  context.stroke();

  //draw curl shadow
  context.beginPath();
  context.rect(0, leadingEdge, canvas.width, curlShadow);
  var drop = context.createLinearGradient(canvas.width, 0, canvas.width, leadingEdge + curlShadow);
  drop.addColorStop(1.00, 'rgba(0, 0, 0,0.11)');
  drop.addColorStop(0.6, 'rgba(0, 0, 0, 0.16)');
  drop.addColorStop(0.8, 'rgba(0, 0, 0, 0.15)');
  drop.addColorStop(0.1, 'rgba(0, 0, 0, 0.08)');
  context.fillStyle = drop;
  context.fill();

  if (startY < canvas.height) {
    requestAnimFrame(function () {
      animateDown(canvas, startY + linearDistEachFrame, time);
    });
  } else {
    
  }
}

function animateUp(canvas, startY, lastTime) {
  window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();

  var context = canvas.getContext('2d');
  var date = new Date();
  var time = date.getTime();
  var timeDiff = time - lastTime;

  //how fast our animation runs
  var speed = 300;
  var linearDistEachFrame = speed * timeDiff / 1000;
  var marqueeSize = 180; //why is this called marqueeSize? 

  //size of the curl shadow, the main rectangle, and the top edge shadow 
  var mainRect = 40;
  var curlShadow = 3;
  var topEdgeSize = 2;

  // Establish the leading edge of the scroll
  var coefficient = (canvas.height - startY) / (canvas.height);
  var leadingEdge = startY + marqueeSize * coefficient;

  // Clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  //draw the overlay
  context.beginPath();
  context.rect(0, 0, canvas.width, startY);
  var grd = context.createLinearGradient(canvas.width, 0, canvas.width, startY);
  grd.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
  context.fillStyle = grd;
  context.fill();

  //draw main rect 
  var grd = context.createLinearGradient(canvas.width, leadingEdge, canvas.width, leadingEdge - mainRect);
  grd.addColorStop(1.00, 'rgba(255, 255, 255, 0.16)');
  grd.addColorStop(0.73, 'rgba(255, 255, 255, 0.16)');
  grd.addColorStop(0.43, 'rgba(226, 226, 226, 0.4)');
  grd.addColorStop(0.20, 'rgba(255, 255, 255, 0.16)');
  context.beginPath();
  context.rect(0, leadingEdge, canvas.width, startY - leadingEdge);
  context.fillStyle = grd;
  context.strokeStyle = 'rgba(000, 000, 000, 0.06)';
  context.fill();
  context.stroke();

  //draw curl shadow
  context.beginPath();
  context.rect(0, leadingEdge, canvas.width, curlShadow);
  var drop = context.createLinearGradient(canvas.width, 0, canvas.width, leadingEdge + curlShadow);
  drop.addColorStop(1.00, 'rgba(0, 0, 0,0.11)');
  drop.addColorStop(0.6, 'rgba(0, 0, 0, 0.16)');
  drop.addColorStop(0.8, 'rgba(0, 0, 0, 0.15)');
  drop.addColorStop(0.1, 'rgba(0, 0, 0, 0.08)');
  context.fillStyle = drop;
  context.fill();

  if (startY > -300) {
    requestAnimFrame(function () {
      animateUp(canvas, startY - linearDistEachFrame, time);
    });

  } else {

  }

}