
(function(){
	
var modules = [
	'ngRoute',
	'ui.bootstrap'
];

// add components to modules
var components = [
	'topnav'
];
components.forEach(function(v){modules.push(v+'Component');});

// add views to modules
var views = [
	'home',
	'projects',
	'articles',
	'bookings'
];
views.forEach(function(v){modules.push(v+'ViewModule');});
	
// init app
var app = angular.module('openRentstockApp', modules);

// add routes
app.config(['$routeProvider',
	function($routeProvider) {
		
	$routeProvider.
    	when('/', {
        	templateUrl: 'views/home/home.html',
        	controller: 'homeViewCtrl'
		});
	
	views.forEach(function(id){
		$routeProvider.when('/'+id, {
			templateUrl: 'views/'+id+'/'+id+'.html',
        	controller: id+'ViewCtrl'});
		}
	);
  }]);
 })();
  
