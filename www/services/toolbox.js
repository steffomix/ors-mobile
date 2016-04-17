angular.module('app').factory('toolbox', function(){
	
	return {
		
		/*
		calculare brightness from html-colors
		@color string: css color with 6 digits
		@sw bool: true result bool 0-1, false in float 0-255
		@return 
			sw = true: 1-white, 0-black
			sw = false: 255-white, 0-black
		*/
		brightness: function(color, sw){
			var c = this.colorToRgb(color);
			var b = Math.sqrt(0.299 * Math.pow(c[0], 2) + 0.587 * Math.pow(c[1], 2) + 0.114 * Math.pow(c[2], 2));
			return sw ? Math.floor(b / 128) : b;
		},
		
		/*
		darken css color
		@color css hex color
		@percent 0-100 amount in % to darken
		@return css hex color without # prefix
		*/
		darken: function(color, percent){
			var c = this.colorToRgb(color);
			c.forEach(function(col, i){
				c[i] = Math.max(0, Math.min(255, Math.round(col / 100 * (100 - percent))));
			});
			return c[0].toString(16)+c[1].toString(16)+c[2].toString(16);
		},
		
		/*
		convert html-color to rgb array
		@color string html-color
		@asHex bool true: hex, false: int
		@return array [r, g, b]
		*/
		colorToRgb: function(color, asHex){
			var c = /#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(color);
			return asHex ? [c[1], c[2], c[3]] : [parseInt(c[1], 16), parseInt(c[2], 16), parseInt(c[3], 16)];
		},
		
		
		/*
		format time from database int to formated date
		@t int from Date.getTime()
		@return string 'dd.MM.yyyy hh:mm'
		*/
		formatDate: function(t){
			var d = new Date();
			d.setTime(t);
			return d.getDate()+'.'+d.getMonth()+'.'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes();
		}
		
	};
	
});
