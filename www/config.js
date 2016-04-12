// datepicker
angular.module('app')
.config(function($datepickerProvider){
	angular.extend($datepickerProvider.defaults, {
		dateFormat: 'dd.MM.yyyy',
		startWeek: 1,
		container: 'body',
		animation: 'none',
		useNative: false
	});
});

// timepicker
angular.module('app')
.config(function($timepickerProvider){
	angular.extend($timepickerProvider.defaults, {
		timeFormat: 'HH:mm',
		length: 7,
		minuteStep: 10,
		useNative: false,
		animation: 'none'
	});
});


// http://stackoverflow.com/questions/24615103/angular-directives-when-and-how-to-use-compile-controller-pre-link-and-post/24615261#24615261
angular.module('app').directive('mce', function($timeout){
	return {
		restrict: 'AE',
    	replace: false,
    	template: '',
		controller: function($scope, $element, $attrs, $transclude){
            // Controller code goes here.
        },
        compile: function compile(tElement, tAttributes, transcludeFn){
            // Compile code goes here.
            return {
                pre: function preLink(scope, element, attributes, controller, transcludeFn){
                    // Pre-link code goes here
					scope.mceOptions = {
						//inline: false,
						height: 400,
						plugins: 
						'advlist autolink lists link image charmap print preview anchor '
						+ 'searchreplace visualblocks code fullscreen '
						+ 'insertdatetime media table contextmenu paste code',
						skin: 'lightgray',
						toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
						theme : 'modern'
					};
                },
                post: function postLink(scope, element, attributes, controller, transcludeFn){
                    // Post-link code goes here
                }
            };
        }


	};
});


angular.module('app')
.config(function($alertProvider){
	angular.extend($alertProvider.defaults, {
		animation: 'am-fade',
		dismissable: true,
		placement: 'top',
		container: '#alerts',
		show: true
	});
});
