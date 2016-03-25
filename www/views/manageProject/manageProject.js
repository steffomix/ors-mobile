angular.module('orsProjectModule').
controller('manageProjectCtrl', function($scope, $http, $routeParams, $location){
	var id = $routeParams.id;
	
	$scope.project = {};
	
	$http.get('projects.json').then(
		function(data){
			var p = data.data[0];
			for(var e in p){
				if(p.hasOwnProperty(e)) $scope.project[e] = p[e];
			}
		},
		function(e){console.log(e);});
		
	
});
