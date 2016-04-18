// datepicker
(function(){
	var app = angular.module('app');
	
	app.config(function($datepickerProvider){
		angular.extend($datepickerProvider.defaults, {
			dateFormat: 'dd.MM.yyyy',
			startWeek: 1,
			//container: 'body',
			animation: 'none',
			useNative: false,
			width: 300
		});
	});

// timepicker
	app.config(function($timepickerProvider){
		angular.extend($timepickerProvider.defaults, {
			timeFormat: 'HH:mm',
			length: 7,
			minuteStep: 10,
			useNative: false,
			animation: 'none'
		});
	});

	app.config(function($alertProvider){
		angular.extend($alertProvider.defaults, {
			animation: 'am-fade-and-slide-top',
			placement: 'top'
		});
	});

// http://stackoverflow.com/questions/24615103/angular-directives-when-and-how-to-use-compile-controller-pre-link-and-post/24615261#24615261
	app.directive('mce', function($timeout){
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

	/*
	alert
	*/
	app.config(function($alertProvider){
		angular.extend($alertProvider.defaults, {
			animation: 'am-fade-and-scale',
			backdropAnimation: 'am-fade-and-scale',
			dismissable: true,
			placement: 'top',
			container: '#alerts',
			show: true,
			templateUrl: 'ors-alert.tpl'
		});
	});

	app.run(function($templateCache){
		$templateCache.put(
		'ors-alert.tpl', 
		'<div class="alert" ng-class="[type ? \'alert-\' + type : null]" ng-click="$hide()">\
  		<strong ng-bind="title"></strong>&nbsp;<span ng-bind-html="content"></span>\
		</div>'
		);
	});

	/*
	modal
	*/
	
	app.config(function($modalProvider) {
  		angular.extend($modalProvider.defaults, 
		{
    		animation: 'am-fade-and-scale',
			backdropAnimation: 'am-scale',
			//templateUrl: 'ors-modal.tpl'
  		});
	});
	app.run(function($templateCache){
		$templateCache.put(
		'ors-modal.tpl', 
		'<div class="modal" tabindex="-1" role="dialog" aria-hidden="true"> \
  			<div class="modal-dialog"> \
    			<div class="modal-content"> \
      				<div class="modal-header" ng-show="title"> \
        				<button type="button" class="close" aria-label="Close" ng-click="$hide()"><span aria-hidden="true">&times;</span></button> \
        				<h4 class="modal-title" ng-bind="title"></h4> \
      				</div> \
      			<div class="modal-body" ng-bind="content" style="overflow: auto;"></div> \
				   <div class="modal-footer">\
        				<button type="button" class="btn btn-default" ng-click="$hide()">Close</button>\
      				</div>\
				</div> \
  			</div>\
		</div>'
		);
	});
	
		

	
	
	
})();
