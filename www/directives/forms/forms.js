angular.module('app').directive('formInput', function(){
	alert('test');
	return {
		restrict: 'E',
		scope: {
			source: '='
			},
		templateUrl: 'directives/forms/form-input.tpl.html'
	};
});
