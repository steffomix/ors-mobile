angular.module('app').
filter('nl2br', function(){
	return function(txt){
		return txt.split('\n').join('<br />')
			.split(' ').join('&nbsp;')
			.split('\t').join('&nbsp;&nbsp;&nbsp;&nbsp;');
	};
});
