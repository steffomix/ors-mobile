// http://stackoverflow.com/questions/24615103/angular-directives-when-and-how-to-use-compile-controller-pre-link-and-post/24615261#24615261
angular.module('app').directive('projectsMonth', function($timeout){
	var month = {
		
	};
	
	return {
		restrict: 'E',
    	replace: false,
    	template: '',
		controller: function($scope, $element, $attrs, $transclude){
            // Controller is called second.
        },
        compile: function compile(tElement, tAttributes, transcludeFn){
            // Compile is called first
            return {
                pre: function preLink(scope, element, attributes, controller, transcludeFn){
                    // Pre-link is called third

                },
                post: function postLink(scope, element, attributes, controller, transcludeFn){
                    // Post-link is called last
                }
            };
        }
	};
});

