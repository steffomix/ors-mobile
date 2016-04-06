angular.module('openRentstockApp')
.factory('orsQuerys', function($http){
	
	return {
		
		// projects
		'select projects' : 'select * from projects order by start desc',
		'select project' : 'select p.*, chiefs.name as chief, chiefs.id as cid '
			+'from projects as p '
			+'join chiefs on p.id = chiefs.id '
			+'where p.id = :id',
			
		// project chiefs
		'select chiefs' : 'select * from chiefs order by name'
		
	};
	
	
});
