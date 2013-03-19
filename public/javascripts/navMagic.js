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
	$("#signUp").click(
		function() {
			$('#pickEmail').fadeIn(500);
			$('.loginHead').fadeOut(10);
			$('.signupHead').fadeIn(500);
			$('.hideMe').fadeOut(10);
			$('#createAccount').fadeIn(500);
			$('#loginForm').find('#username').focus();
		});
});