

(function(){
	var app = angular.module('openRentstockApp', []);
	
	app.controller('gemCtrl', function($scope, $http){
		var _this = this;
		
		$http.get('data.json').success(function(data) {
    		$scope.gems = data;
  		});
		$scope.orderProp = 'age';
	});
	
	
})();


