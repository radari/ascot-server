window.onload= function (){
	var canvas= document.getElementById("overlay");
	var picture = document.getElementById("picture");
	canvas.height=picture.height;
	canvas.width=picture.width;
	var canvasHeight=canvas.height;
	var canvasWidth=canvas.width;

	var date= new Date();
	var time= date.getTime();
	
	animateDown(0, time);

}

function animateDown (startY, lastTime) {
	window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame || 
    window.oRequestAnimationFrame || 
    window.msRequestAnimationFrame ||
    function(callback) {
    window.setTimeout(callback, 1000 / 60);
  	};
	})();
	//disable button while animation is running 
	//document.getElementById("animateDown").disabled=true;

	var canvas= document.getElementById("overlay");
	var context=canvas.getContext('2d');
	var date= new Date();
	var time= date.getTime();
	var timeDiff= time-lastTime;

	//how fast our animation runs
	var speed= 300;
	var linearDistEachFrame=speed*timeDiff/1000;
	var marqueeSize=180; //why is this called marqueeSize? 

	//size of the curl shadow, the main rectangle, and the top edge shadow 
	var mainRect=40;
	var curlShadow=3;
	var topEdgeSize = 2;
	
	// Establish the leading edge of the scroll
	var coefficient=(canvas.height-startY)/(canvas.height);
	var leadingEdge = startY + marqueeSize * coefficient;

	// Clear canvas
	context.clearRect(0, 0, canvas.width, canvas.height);

	//draw the overlay
	context.beginPath();
	context.rect(0,0,canvas.width, startY);
	var grd=context.createLinearGradient(canvas.width,0,canvas.width,startY);
	grd.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
	context.fillStyle= grd;
	context.fill();

	//draw main rect 
	var grd= context.createLinearGradient(canvas.width, leadingEdge, canvas.width, leadingEdge-mainRect);
	grd.addColorStop(1.00, 'rgba(255, 255, 255, 0.16)');
	grd.addColorStop(0.73, 'rgba(255, 255, 255, 0.16)');
	grd.addColorStop(0.43, 'rgba(226, 226, 226, 0.4)');
	grd.addColorStop(0.20, 'rgba(255, 255, 255, 0.16)');
	context.beginPath();
	context.rect(0, leadingEdge, canvas.width, startY - leadingEdge);	
	context.fillStyle=grd;
	context.strokeStyle = 'rgba(000, 000, 000, 0.06)';
	context.fill();
	context.stroke();

	//draw curl shadow
	context.beginPath();
	context.rect(0,leadingEdge,canvas.width,curlShadow);
	var drop= context.createLinearGradient(canvas.width, 0, canvas.width, leadingEdge+curlShadow);
	drop.addColorStop(1.00, 'rgba(0, 0, 0,0.11)');
	drop.addColorStop(0.6, 'rgba(0, 0, 0, 0.16)');
	drop.addColorStop(0.8, 'rgba(0, 0, 0, 0.15)');
	drop.addColorStop(0.1, 'rgba(0, 0, 0, 0.08)');
	context.fillStyle=drop;
	context.fill();
	
	if (startY < canvas.height) {
	requestAnimFrame(function(){
		animateDown(startY+linearDistEachFrame, time );
		
	
	});

	}

	else {
		//enable button while animation is running 
		//document.getElementById("animateDown").disabled=false;
		var upOrDown=true;
	}

}

function animateUp (startY, lastTime) {
	window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame || 
    window.oRequestAnimationFrame || 
    window.msRequestAnimationFrame ||
    function(callback) {
    window.setTimeout(callback, 1000 / 60);
  	};
	})();

	var canvas= document.getElementById("overlay");
	var context=canvas.getContext('2d');
	var date= new Date();
	var time= date.getTime();
	var timeDiff= time-lastTime;

	//how fast our animation runs
	var speed= 300;
	var linearDistEachFrame=speed*timeDiff/1000;
	var marqueeSize=180; //why is this called marqueeSize? 

	//size of the curl shadow, the main rectangle, and the top edge shadow 
	var mainRect=40;
	var curlShadow=3;
	var topEdgeSize = 2;
	
	// Establish the leading edge of the scroll
	var coefficient=(canvas.height-startY)/(canvas.height);
	var leadingEdge = startY + marqueeSize * coefficient;

	// Clear canvas
	context.clearRect(0, 0, canvas.width, canvas.height);

	//draw the overlay
	context.beginPath();
	context.rect(0,0,canvas.width, startY);
	var grd=context.createLinearGradient(canvas.width,0,canvas.width,startY);
	grd.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
	context.fillStyle= grd;
	context.fill();

	//draw main rect 
	var grd= context.createLinearGradient(canvas.width, leadingEdge, canvas.width, leadingEdge-mainRect);
	grd.addColorStop(1.00, 'rgba(255, 255, 255, 0.16)');
	grd.addColorStop(0.73, 'rgba(255, 255, 255, 0.16)');
	grd.addColorStop(0.43, 'rgba(226, 226, 226, 0.4)');
	grd.addColorStop(0.20, 'rgba(255, 255, 255, 0.16)');
	context.beginPath();
	context.rect(0, leadingEdge, canvas.width, startY - leadingEdge);	
	context.fillStyle=grd;
	context.strokeStyle = 'rgba(000, 000, 000, 0.06)';
	context.fill();
	context.stroke();

	//draw curl shadow
	context.beginPath();
	context.rect(0,leadingEdge,canvas.width,curlShadow);
	var drop= context.createLinearGradient(canvas.width, 0, canvas.width, leadingEdge+curlShadow);
	drop.addColorStop(1.00, 'rgba(0, 0, 0,0.11)');
	drop.addColorStop(0.6, 'rgba(0, 0, 0, 0.16)');
	drop.addColorStop(0.8, 'rgba(0, 0, 0, 0.15)');
	drop.addColorStop(0.1, 'rgba(0, 0, 0, 0.08)');
	context.fillStyle=drop;
	context.fill();
	
	if (startY > -300) {
	requestAnimFrame(function(){
		animateUp(startY-linearDistEachFrame, time );
	});

}

}