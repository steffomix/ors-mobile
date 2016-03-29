angular.module('openRentstockApp').
controller('projectsViewCtrl', 
	['$scope', '$location', 'orsDb', 
	function($scope ,$location, db){
		
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
			
			var tr = db.transaction();
			
			var q = tr.query("select * from projects");
			tr.execute(function(data){
				console.log(data);
				$scope.projects = data.result;
			});
			
			
		}
		page(1);
	}]);

