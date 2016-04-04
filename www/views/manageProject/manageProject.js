angular.module('openRentstockApp').
controller('manageProjectCtrl', ['$scope', '$routeParams', 'orsDb' ,function($scope, $routeParams, db){
	
	var userId = $routeParams.id;
  	$scope.mce=mce();;
	// project
	db.query(
		['select p.*, chiefs.name as chief, chiefs.id as cid',
		'from projects as p',
		'join chiefs on p.id = chiefs.id',
		'where p.id = :id;'].join(' '),
		[['id', userId, 'int']], 
		function (data){
			$scope.project = data.first();
		}
	);
	
	// chiefs
	db.query('select id, name from chiefs', [], function(data){
		$scope.chiefs = data.all();
	});
	
  
}]);

/*
	user

|      |   [id] = Number(1) 1
|      |   [name] = String(11) "First try"
|      |   [start] = String(18) "2016-2-15 09:00:00"
|      |   [end] = String(17) "2016-3-8 09:00:00"
|      |   [info] = String(19) "YYYY-MM-DD HH:MM:SS"
*/
