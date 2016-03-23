
(function(){

	var modules = [
		'ngRoute',
		'ui.bootstrap',
	];

	var services = [].forEach(function(v){modules.push(v + 'Service');});

	var directives = [].forEach(function(v){modules.push(v + 'Directive');});

// add components to modules
	var components = [
		'topnav'
	];
	components.forEach(function(v){modules.push(v + 'Component');});

// add views to modules
	var views = [
		'home',
		'projects',
		'manageProject',
		'articles',
		'bookings'
	];
	views.forEach(function(v){modules.push(v + 'ViewModule');});

// init app
	var app = angular.module('openRentstockApp', modules);

// add routes
	app.config(['$routeProvider',
		function($routeProvider){
			// route page load url
			$routeProvider.when('/', {
				templateUrl: 'views/home/home.html',
				controller: 'homeViewCtrl'
			});
			
			// route views
			views.forEach(function(id){
				$routeProvider.when('/' + id, {
					templateUrl: 'views/' + id + '/' + id + '.html',
					controller: id + 'ViewCtrl'});
			}
			);
		}]);

})();
  
