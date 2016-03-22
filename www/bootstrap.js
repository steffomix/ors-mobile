

angular.module('openRentstockApp', 
	['topnav', 
	'ngRoute',
	'homeView'
	])
	
.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/home/home.html',
        controller: 'homeViewCtrl'
      });
  }]);
