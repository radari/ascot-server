$(document).ready(function () {
	$('#valueProps li').click(function() {
		var index = $(this).index();
		var child=index+1;
		for (var i=0;i<4; i++) {
			$('#valueProps li:nth-child('+i+')').removeClass("selected");
		};
		$('#valueProps li:nth-child('+child+')').addClass("selected");
	});

	$('#valueProps li:nth-child(1)').click(function() {
		$('.bloggers').css("display", "none");
		$('.advertisers').css("display", "none");
		$('.brands').fadeIn(100);
	});
	
	$('#valueProps li:nth-child(2)').click(function() {
		$('.brands').css("display", "none");
		$('.advertisers').css("display", "none");
		$('.bloggers').fadeIn(100);
	});

	$('#valueProps li:nth-child(3)').click(function() {
		$('.brands').css("display", "none");
		$('.bloggers').css("display", "none");
		$('.advertisers').fadeIn(100);
	});
});