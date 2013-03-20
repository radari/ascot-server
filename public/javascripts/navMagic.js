$(document).ready(function () {
	$("#nav li").hover(
	function () {
		$(this).find('h3').hide();
		$(this).find('p').fadeIn(100);
	}, 
	function() {
		$(this).find('p').hide();
		$(this).find('h3').fadeIn(200);
	});
});

$(document).ready(function() {
  $('form.register').hide();
	$("#signUp").click(
		function() {
			$('form.login').fadeOut(10);
			$('form.register').fadeIn(500);
		});
});
