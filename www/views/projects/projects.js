angular.module('openRentstockApp').
controller('projectsViewCtrl', 
	['$scope', '$location', '$timeout', 'orsDb', 
	function($scope ,$location, $timeout, db){
		
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
			
			var q = tr.query("select projects");
			tr.execute(function(rows){
				var rows = rows.all();
				rows.forEach(function(r, i){
					rows[i]['start'] = formatDate(r.start);
					rows[i]['end'] = formatDate(r.end);
				});
				$scope.projects = rows;
			});
		}
		page(1);
		
		function formatDate(t){
			var d = new Date();
			d.setTime(t);
			d = d.getFullYear()+'.'+d.getMonth()+'.'+d.getDate()+' '+d.getHours()+':'+d.getMinutes();
			return d;
		}
	}]);

