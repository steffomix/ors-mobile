angular.module('openRentstockApp')
.controller('topnavCtrl', ['$scope', function($scope){
		
	$scope.admin = [
		{
			'text' : 'SqLite Amin',
			'href': 'db/admin/admin.php',
			'target': '_blank'
		},
		{
			'text' : 'AngularJs API',
			'href': 'https://docs.angularjs.org/guide',
			'target': '_blank'
		},
		{
			'text' : 'Bootstrap 3 CSS',
			'href': 'http://getbootstrap.com/css/',
			'target': '_blank'
		},
		{
			'text' : 'AngularStrap',
			'href': 'http://mgcrea.github.io/angular-strap/#',
			'target': '_blank'
		},
		{
			'text' : 'Phonegap',
			'href': 'https://build.phonegap.com/apps',
			'target': '_blank'
		}
	];
	
	$scope.create = [
		{
			'text' : 'Project',
			'href': '#/manageProject',
			'target': '_self'
		}
	];
}]);
