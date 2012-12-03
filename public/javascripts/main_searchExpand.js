

$(document).ready(function() {
	$('#main_search').click(function() {
		$('#main_search').animate({
			 opacity: .5,
	 		 width: '20%'
	 		 }, 800	 
		);
		$('#glass').animate({
			 opacity: .5,
	 		 right: '10.5%'
	 		 }, 800	 
		);
	});
});