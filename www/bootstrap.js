
(function(){

	// lib modules
	var modules = [
		'ngRoute',
		//'formly',
		//'formlyBootstrap',
		'ngSanitize',
		'mgcrea.ngStrap',
		'ngAnimate',
		'ng-fastclick',
		'ui.tinymce'
	];

	// app modules and dependecies
	[
		// common
		['app', []]
	].forEach(function(v){
		angular.module(v[0], v[1]);
		modules.push(v[0]);
	});

	// routes
	routes = [
		['projects', 'projects'],
		['manageProject/:id?', 'manageProject'],
		['articles', 'articles'],
		['bookings',  'bookings']
	];

	// init app
	var app = angular.module('openRentstockApp', modules);
	
	
	// set routes
	app.config(function($routeProvider){
		
		// default and fallback route
		$routeProvider.when('/',
			{
				templateUrl: 'views/home/home.html'
			});
		// other routes
		routes.forEach(function(r){
			$routeProvider.when('/' + r[0],
			{
				templateUrl: 'views/' + r[1] + '/' + r[1] + '.html'
			}
			);
		});
		// fallback
		$routeProvider.otherwise({redirectTo: "/"});
	});
	
	app.controller('consoleCtrl', function($scope){
		var i = 0;
		
		$scope.msg = window.startErrors;
		
		function addMsg(msg, isLog){
			var stack = new Error('').stack.split('\n');
			stack.splice(0, 3);
			try{
				m = angular.toJson(msg);
				msg = my_dump(msg, '', false, 2);
			}catch(e){
				// ignore
			}
			
  			$scope.msg.unshift({
				id: i++,
				isLog: isLog,
				msg: msg + '\n\n' + stack.join('\n')
			});
		}
		
		console.log =  function(msg){
			addMsg(msg, true);
			return true;
		};
		
		console.error =  function(msg, args){
			addMsg(msg, false);
			return true;
		};
		
	});
})();
	

