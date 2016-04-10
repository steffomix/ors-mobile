angular.module('app')
.factory('date', function(){

	var rx = {
		rxLocale: /(\d{1,2})\.(\d{1,2})\.(\d{4})\, (\d{2})\:(\d{2})/,
		rxDb: /(\d{4})\-(\d{2})\-(\d{2}) (\d{2})\:(\d{2})/,
		rxJson: /(\d{4})\-(\d{2})\-(\d{2})T(\d{2})\:(\d{2})/,
		rxInt: /(\d{4})(\d{2})(\d{2})/,
		rxFloat: /(\d{4})(\d{2})(\d{2})\.(\d{2})(\d{2})/,
		get: function(name){
			return this['rx' + name[0].toUpperCase() + name.slice(1)];
		}
	};

	// parse array from string with given regexp rxDb or rxPicker
	// 
	// result in [yyyy, MM, dd, hh, mm]
	// rx: regexp from rx
	// date: string
	// time: optional, overwrites time from date
	function parse(rx, date, h, m){
		date = rx.exec(date);
		date.shift();
		h != undefined && (date[3] = two(h));
		m != undefined && (date[4] = two(m));
		return date;
	}

	// array from Date-object
	// same result as parse(): [yyyy, MM, dd, hh, mm]
	function asArray(d, h, s){
		//toLocaleString
		return parse(rx.get('locale'), d.toLocaleString(), h, s);
	};


	// zerofill to 2 digits
	function two(n){
		return ('00' + n).slice(-2);
	}

	// instance
	return {
		roundMinutes: function(date){
			date.setMinutes(Math.round(date.getMinutes() / 10) * 10, 0, 0);
		},

		// combine date with time
		// date: date in given format used for the date part
		// time: date: date in guven format used for the time part
		// from: 'date', 'db', 'json', 'float', 'int', 'array', 'arrayNumbers'
		// 	 default: picker
		// to:   'date', 'db', 'json', 'float', 'int', 'array', 'arrayNumbers'
		//   default: db
		// 
		combine: function(date, time, from, to){
			!from && (from = 'date');
			!to && (to = 'date');
			time = this.convert(time, from, 'array');
			return this.convert(date, from, to, time[3], time[4]);
		},

		// date: any format
		// from: 'date', 'db', 'json', 'float', 'int', 'array', 'arrayNumbers'
		// to:   'date', 'db', 'json', 'float', 'int', 'array', 'arrayNumbers'
		// h: optional, set hour
		// m: optional set minute
		convert: function(date, from, to, h, m){
			// convert to array first
			switch(from){
				case 'date':
					this.roundMinutes(date);
					from = asArray(date);
					break;
				case 'db':
				case 'json':
				case 'float':
				case 'int':
					from = parse(rx.get(from), date, h, m);
					break;
				case 'arrayNumbers':
					break;
				default:
					throw('Converter ' + from + ' not supported. Use date, db, picker, float or int');
			}
			// set optional hour and minute
			h != undefined && (from[3] = two(h));
			m != undefined && (from[4] = two(m));

			// convert to target format
			switch(to){
				case 'array':
					to = from;
					break;
				case 'date':
					to = new Date(from[0], from[1]-1, from[2], from[3], from[4]);
					break;
				case 'db':
					to = [from[0], two(from[1]), two(from[2])].join('-') + ' ' + two(from[3]) + ':' + two(from[4]) + ':00';
					break;
				case 'json':
					to = from[0] + '-' + two(from[1]) + '-' + two(from[2]) + 'T' + two(from[3]) + ':' + two(from[4]) + ':00.000Z';
					break;
				case 'float':
					to = parseFloat('' + from[0] + two(from[1]) + two(from[2]) + '.' + two(from[3]) + two(from[4]));
					break;
				case 'int':
					to = parseInt('' + two(from[0]) + two(from[1]), +two(from[2]));
					break;
				case 'arrayNumbers':
					to = [];
					from.forEach(function(f, i){
						to[i] = parseInt(f);
					});
					break;
				default:
					throw('Converter ' + to + ' not supported. Use date, db, picker, float, int or array');
			}
			return to;
		}

	};
});
