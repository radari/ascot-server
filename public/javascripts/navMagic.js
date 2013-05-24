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
