angular.module('app').
filter('nl2br', function(){
	return function(txt){
		
		function format(txt){
			return txt
			.split('\\r').join('\r')
			.split('\\n').join('\n')
			.split('\n').join('<br>')
			.split(' ').join('&nbsp;')
			.split('\t').join('&nbsp;&nbsp;&nbsp;&nbsp;');
		}
		
		if((typeof txt === 'string' || txt instanceof String)){
			var t;
			try{
				return my_dump(JSON.parse(txt), '', false);
			}catch(e){
				return '<i>JSON.parse: '+e+'</i>\n'+format(txt);
			}
			
		}
		return my_dump(txt, '', false);
	};
});
