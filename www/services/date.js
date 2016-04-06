angular.module('app')
.factory('date', function(){
	
	var rxDb = /(\d{4})\-(\d{1,2})\-(\d{1,2}) (\d{2})\:(\d{2})/,
	rxPicker = /(\d{4})\-(\d{2})\-(\d{2})T(\d{2})\:(\d{2})/;
	
	// parse array from string with given regexp rxDb or rxPicker
	// 
	// result in [yyyy, MM, dd, hh, mm]
	// rx: regexp rxDb or rxPicker
	// date: db- or picker date
	// time: optional, overwrite time from date
	function parse(rx, date, time){
		date = rx.exec(date);
		date.shift();
		if(time){
			time = rx.exec(time);
			date[4] = time.pop();
			date[3] = time.pop();
		}
		return date;
	}
	
	// zerofill to 2 digits
	function two(n){
		return ('00'+n).slice(-2);
	}
	
	// array from Date-object
	// same result as parse(): [yyyy, MM, dd, hh, mm]
	function asArray(d, h, s){
		var ar;
		if(!d){
			d = new Date();
		}
		return [
			d.getFullYear(),
			d.getMonth(),
			d.getDay(),
			h ? h : d.getHours(),
			s ? s : d.getMinutes()
		];
	}
	
	// instance
	return {
		
		// yyyy-MM-ddT00:00:00.000Z --> yyyy-m[m]-d[d] hh:mm:ss
		pickerToDb: function(date, time){
			var d = parse(rxPicker, date, time);
			return d[0]+'-'+d[1]+'-'+d[2]+' '+d[3]+':'+d[4]+':00';
		},
		
		// yyyy-m[m]-d[d] hh:mm:ss --> yyyy-MM-ddT00:00:00.000Z
		dbToPicker: function(d, t){
			var d = parse(rxDb, d, t);
			return d[0]+'-'+two(d[1])+'-'+two(d[2])+'T'+two(d[3])+':'+two(d[4])+':00.000Z';
		},
		
		// picker-string from Date-object
		// d: Date
		// h: optional hour eg.: '09'
		// m: opttional minute eg.: '00'
		dateToPicker: function(d, h, m){
			return d.getFullYear() +'-'+ two(d.getMonth())+'-'+two(d.getDay())+'T'+
				(h ? two(h) : two(d.getHours())) +':'+(m ? two(m) : two(d.getMinutes()))+':00.000Z';
		},
		
		// to float from db-date
		// date: string
		// fromPicker: true: rxPicker, false/default: rxDb
		toFloat: function(d, fromPicker){
			d = parse((fromPicker ? rxPicker : rxDb), d);
			return parseFloat([d[0], d[1], d[2], '.'+ d[3], d[4]].join(''));
		},
		
		// to int from db-date
		// date: string
		// fromPicker: true: rxPicker, false/default: rxDb
		toInt: function(d){
			d = parse((fromPicker ? rxPicker : rxDb), d);
			return parseInt([d[0], d[1], d[2]].join(''));
		}
	};
});
