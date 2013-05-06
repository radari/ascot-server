function customOverlayController($scope) {
		
	
$scope.options=[{
		name:'Bordered',
		isChecked:'true'
	},
	{
		name:'Numbered',
		isChecked:'false'
	}]
	$scope.checkIfChecked= function() {
		if ($scope.options[0].isChecked==true) {
			$('.exampleTag').addClass("bordered");
		}
		else if ($scope.options[0].isChecked==false) {
			$('.exampleTag').removeClass("bordered");
		}
		else if ($scope.options[1].isChecked==true) {
			$('.exampleTag').css( "color", "white" );
		}
		else if ($scope.options[1].isChecked==false) { 
			$('.exampleTag').css( "color", "#171717" );
		}
		else {
			}
	}
}