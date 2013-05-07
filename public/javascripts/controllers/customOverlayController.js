function customOverlayController($scope) {
		$scope.tagStyleOptions=[{
				name:'Bordered',
				isChecked:'true'
			},
			{
				name:'Numbered',
				isChecked:'false'
			}]

		$scope.checkIfCheckedBordered= function () {
			alert('this is being called');
		}
		$('INPUT.minicolors').minicolors({opacity:true});
		

		$scope.changeColor= function() {
			var colorChosen= $('INPUT.minicolors').minicolors('rgbaString')
			$('.exampleTag').css('background-color', colorChosen);
		}

		$scope.checkIfChecked= function() {
			if ($scope.tagStyleOptions[0].isChecked==true) {
				$('.exampleTag').addClass("bordered");
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