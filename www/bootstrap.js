
(function(){

	// lib modules
	var modules = [
		'ngRoute',
		//'ui.bootstrap',
	];

	// app modules and dependecies
	[
		['orsProjectModule', ['ngRoute']],
		['orsArticleModule', ['ngRoute']],
		['orsBookingModule', ['ngRoute']],
		// components
		['topnavComponent', []]
	].forEach(function(v){
		angular.module(v[0], v[1]);
		modules.push(v[0]);
	});

	// routes
	routes = [
		['projects', 'projects'],
		['manageProject/:id', 'manageProject'],
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
		
		$scope.msg = [{
				id: i++,
				isLog: true,
				msg: "test msg"
			}];
		
		function addMsg(msg, isLog){
			$scope.msg.unshift({
				id: i++,
				isLog: isLog,
				msg: msg
			}
			);
		}
		
		console.log =  function(msg){
			addMsg(msg, true);
			return true;
		};
		
		console.error =  function(msg){
			addMsg(msg, false);
			return true;
		};
		
	});
})();
	
	

