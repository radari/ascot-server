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