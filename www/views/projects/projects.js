angular.module('orsProjectModule').
controller('projectsViewCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
		
		var dataUrl = 'projects.json',
			ipp = 25; // items per page

		$scope.projects = [];
		
		$scope.manageProject = function(id){
			$location.path('manageProject/'+id);
		};
		
		
		function getInt(i){
			return (isNaN(i) ? 1 : Math.abs(parseInt(i)));
		};


		function page(page){
			page = getInt(page); // todo

			$http.get(dataUrl).then(
			function(data){
				console.log(data.data);

				data.data.forEach(function(p){
					$scope.projects.push(p);
				});
			},
			function(e){
				console.error(e);
			}
			);
		}
		page(1);
	}]);

