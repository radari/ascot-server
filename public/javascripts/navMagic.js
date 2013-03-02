$(document).ready(function () {
	$("#nav li").hover(
	function () {
		$(this).find('h3').fadeOut(100);
		$(this).find('p').delay(100).fadeIn(100);
	}, 
	function() {
		$(this).find('p').fadeOut(100);
		$(this).find('h3').delay(100).fadeIn(200);
	});
});