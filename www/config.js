// datepicker
angular.module('app')
.config(function($datepickerProvider) {
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
.config(function($timepickerProvider) {
  angular.extend($timepickerProvider.defaults, {
    timeFormat: 'HH:mm',
    length: 7,
	minuteStep: 10,
	useNative: false,
	animation: 'none'
  });
});


// tinymce
function mce(){
	return {
    //inline: false,
    height: 400,
    plugins: 
    'advlist autolink lists link image charmap print preview anchor '
    +'searchreplace visualblocks code fullscreen '
    +'insertdatetime media table contextmenu paste code',
	skin: 'lightgray',
	toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
    theme : 'modern'
  };
}

angular.module('app')
.config(function($alertProvider) {
  angular.extend($alertProvider.defaults, {
    animation: 'am-fade',
	dismissable: true,
	placement: 'top',
	container: '#alerts',
	show: true
  });
});
