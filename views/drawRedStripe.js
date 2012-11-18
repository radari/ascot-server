window.onload= function (){

	
	var canvas=document.getElementById('redStripe');
	var context=canvas.getContext('2d');
	context.beginPath();
	context.rect(0,0,canvas.width, startY);
	var grd=context.createLinearGradient(canvas.width,0,canvas.width,12);
	grd.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
	context.fillStyle= grd;
	context.fill();

}