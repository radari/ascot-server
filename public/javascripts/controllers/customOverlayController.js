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
		else {
			}
	}
}