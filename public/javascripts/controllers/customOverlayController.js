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
			$('.exampleTag').addClass("bordered");
		}, function() {
			$(this).css("text-decoration", "none");
			$(this).css("opacity","1.0")
			$('.exampleTag').removeClass("bordered");
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

		$scope.checkIfCheckedBordered= function () {
			alert('this is being called');
		}
		$('INPUT.minicolors').minicolors({opacity:true});
		$('.slider').slider();

		$scope.changeColor= function() {
			var colorChosen= $('INPUT.minicolors').minicolors('rgbaString')
			$('.exampleTag').css('background-color', colorChosen);
		}

		$scope.checkIfChecked= function() {
			if ($scope.tagStyleOptions[0].isChecked==true) {
				
			}
			else if ($scope.tagStyleOptions[0].isChecked==false) {
				$('.exampleTag').removeClass("bordered");
			}
			else if ($scope.tagStyleOptions[1].isChecked==true) {
				$('.exampleTag').addClass( "numbered");
			}
			else if ($scope.tagStyleOptions[1].isChecked==false) { 
				$('.exampleTag').removeClass("numbered");
			}
			else {
				}
		}
}