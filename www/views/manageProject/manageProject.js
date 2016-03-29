angular.module('openRentstockApp').
controller('manageProjectCtrl', function(){
	
	var vm = this;

  vm.user = {};

  // note, these field types will need to be
  // pre-defined. See the pre-built and custom templates
  // http://docs.angular-formly.com/v6.4.0/docs/custom-templates
  vm.userFields = [
    {
      
      type: 'input'
      
    }
  ];
});

/*

var id = $routeParams.id;
	sql = "select * from projects where id= :id;";
	
	$scope.project = {};
	
	$scope.form ={
		name: {
			id: 'name',
			model: 'project'
		}
	};
	
	function callback(data){
		$scope.project = data.result[0];
	}
	
	db.query(sql, [['id', $routeParams.id, 'int']], callback);
	var vm = this;





|      |   [id] = Number(1) 1
|      |   [name] = String(11) "First try
"
|      |   [start] = String(18) "2016-2-15 09:00:00"
|      |   [end] = String(17) "2016-3-8 09:00:00"
|      |   [info] = String(19) "YYYY-MM-DD HH:MM:SS"
*/
