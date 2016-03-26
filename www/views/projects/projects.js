angular.module('orsProjectModule').
controller('projectsViewCtrl', ['$scope', 'orsDb', function($scope, db){
		
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
			//q.param('id', 1);
			tr.execute(function(data){
				console.log(data);
				projects = data;
			});
			
			
		}
		page(1);
	}]);

