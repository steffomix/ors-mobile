angular.module('app').factory('toolbox', function(){
	
	return {
		
		/*
		calculare brightness from rgb colors like '#1f2d5e'
		@color string: css color with 6 digits
		@sw bool: true result bool 0-1, false in float 0-255
		@return 
			sw = true: 1-white, 0-black
			sw = false: 255-white, 0-black
		*/
		brightness: function(color, sw){
			var c = /#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(color);
			var bright = Math.sqrt(
			0.299 * Math.pow(parseInt(c[1], 16), 2) 
			+ 0.587 * Math.pow(parseInt(c[2], 16), 2) 
			+ 0.114 * Math.pow(parseInt(c[3], 16), 2));
			bright = sw ? Math.floor(bright / 128) : bright;
			return bright;
		}
	};
	
});
