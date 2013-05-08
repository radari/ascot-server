function customOverlayController($scope) {
		$scope.tagStyleOptions=[{
				name:'Bordered',
				isChecked:'true'
			},
			{
				name:'Numbered',
				isChecked:'false'
			}]
		//strikethrough toggle 
		$(".borderToggle").toggle( function() {
			$(this).css("text-decoration", "line-through");
			$(this).css("opacity","0.5")
			$( ".slider" ).slider( "disable" );
			$('.sliderValue').css("opacity", "0.5");
			$('.exampleTag').css("border", "none");

		}, function() {
			$(this).css("text-decoration", "none");
			$(this).css("opacity","1.0")
			$( ".slider" ).slider( "enable" );
			$('.sliderValue').css("opacity", "1");
			$('.exampleTag').addClass("bordered");
			checkValue();
		});
		//show sub menu
		$(".customizeToolbar li:nth-child(1)").hover(function() {
			$(".borderOptions").fadeIn(100);
		})

		$('.borderOptions').mouseleave(function() {
			$(this).fadeOut(100);
		})

		$(".customizeToolbar li:nth-child(2)").hover(function() {
			$(".colorOptions").fadeIn(100);
		})

		$('.colorOptions').mouseleave(function() {
			$(this).fadeOut(100);
		})


		$(".customizeToolbar li:nth-child(3)").hover(function() {
			$('.animationOptions').fadeIn(100);
		})

		$('.animationOptions').mouseleave(function() {
			$(this).fadeOut(100);
		})
		//prevent more than one submenu from being open 
		

		function checkValue() {
				var sliderVal= $(".slider").slider("value");
				$('.sliderValue').html(sliderVal+"px");
				$('.exampleTag').css("border", sliderVal+'px white solid')
			}
		
		$('INPUT.minicolors').minicolors({opacity:true});
		$('INPUT.minicolors2').minicolors({opacity:true});
		$('.slider').slider({
			min:1, 
			max:5,
			value:2,
			slide: function(event, ui) {
				var sliderVal= $(".slider").slider("value");
				$('.sliderValue').html(sliderVal+"px");
				$('.exampleTag').css("border", sliderVal+'px white solid')
			}
		});

		$scope.changeColor= function() {
			var colorChosen= $('INPUT.minicolors').minicolors('rgbaString');
			var colorChosen2= $('INPUT.minicolors2').minicolors('rgbaString');
			$('.exampleTag').css('background-color', colorChosen);
			$('.exampleTag').css('color', colorChosen2);
		}
}