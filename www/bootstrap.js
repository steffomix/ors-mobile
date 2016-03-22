

angular.module('openRentstockApp', 
	[
	'ngRoute',
	'ui.bootstrap',
	'topnav',
	'homeViewModule',
	'projectsViewModule'
	])
	
.config(['$routeProvider',
	function($routeProvider) {
		
	$routeProvider.
    	when('/', {
        	templateUrl: 'views/home/home.html',
        	controller: 'homeViewCtrl'
		});
	
	['home', 'projects', 'articles', 'bookings'].forEach(function(id){
		$routeProvider.when(id, {
			templateUrl: 'views/'+id+'/'+id+'.html',
        	controller: id+'ViewCtrl'});
		}
	);
	
    
  }]);
  
