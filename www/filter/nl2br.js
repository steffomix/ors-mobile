angular.module('app').
filter('nl2br', function(){
	return function(txt){
		return ((typeof txt === 'string' || txt instanceof String)
			?txt
			.split('\n').join('<br>')
			.split(' ').join('&nbsp;')
			.split('\t').join('&nbsp;&nbsp;&nbsp;&nbsp;')
			:txt);
	};
});
