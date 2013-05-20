$(document).ready(function () {
	$("#userName").click(
	function () {
		$('.userMenu').fadeIn(100);
	});
	$('.userMenu').mouseleave(
		function() {
			$('.userMenu').fadeOut(100);
		});
});

$(document).ready(function() {
  $('form.register').hide();
	$("#signUp").click(
		function(event) {
		  event.preventDefault();
			$('form.login').fadeOut(10);
			$('form.register').fadeIn(500);
		});
});
