

(function(){
angular.module('openRentstockApp', ['mod1'])

	.controller('parentCtrl', function($scope){
		$scope.gems=[];
	})
	.controller('childCtrl', function($scope){
		var i = 1;
		$scope.gems.push(i++);
		//$parent.apply(vm, arguments);
		$scope.addItem = function(){
			$scope.gems.push(i++);
		};
	});

angular.module("mod1", [])
	.controller('otherCtrl', function($scope){
		$scope.value ="other controller";
	});
	
})();


