angular.module('openRentstockApp')
.factory('orsDb', ['$http', function($http){
	
	/*
	 * example:
	var tr = db.transaction();
	var q = tr.query('select * from table where id = :id');
	q.param('id', 1);
	tr.execute(function(data){
		// do stuff here
	});
	*/
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	
	function transaction(){

		var querys = [],
			url = 'db/db-query.php';
		
		function QuerySql(params){
			this.param = function(key, value, type){
				params.push({key:key, value:value, type:type});
				return this;
			};
		}
		
		this.query = function(sql){
			var q = {query: sql, params: []};
			querys.push(q);
			return new QuerySql(q.params);
		};
		
		this.execute = function(callback){
			
			$http.post(url, querys).then(
				function(data){
					// console.log({orsDB_response: data});
					if(data.data.errorCode){
						console.error('orsDB-error '+data.data.errorCode+': '
						+ data.data.errorText);
					}
					callback(new Result(data.data));
				},
				function(e){
					console.error(e);
				}
			);
		};
	}
	
	function Result(data){
		var rows = data.result, cursor = 0;
		this.__proto__ = data;
		
		this.next = function(){
			var row;
			try{
				row = rows[cursor];
			}catch(e){
				row = false;
			}
			if(row !== false){
				cursor ++;
				return row;
			}
			return false;
		};
		
		this.first = function(){
			try{
				if(rows.length > 0){
					return rows[0];
				}
				return false;
			}catch(e){
				console.error(e);
				return false;
			}
		};
		
		this.all = function(){
			return rows;
		};
		
		this.reset = function(){
			cursor = 0;
		};
		/*
		'error' => $errorCode,
		'errorText'  => $errorMsg,
		'changes' => $db->changes(),
		'lastInsertId' => $db->lastInsertRowID(),
		'result' => $res
		*/
	}
	
	
	function singleQuery(sql, params, callback){
		var tr = new transaction(), q = tr.query(sql);
		params.forEach(function(p){
			p.length == 2
			 ? q.param(p[0], p[1], '')
			 : q.param(p[0], p[1], p[2]);
		});
		tr.execute(callback);
	}
	
	// return [yyyy, MM, dd, hh, mm]
	// from give or new Date()
	function dateArray(d){
		if(!d){
			d = new Date();
		}
		return [
			d.getFullYear(),
			('00'+d.getMonth()).slice(-2),
			('00'+d.getDay()).slice(-2),
			('00'+d.getHours()).slice(-2),
			('00'+d.getMinutes()).slices(-2)];
	}
	
	// 2016-3-1 09:00:00,2016-3-1 09:00:00
	function parseDate(rx, date, time){
		var dt = new Date();
		return [date ? rx.exec(date) : ['', dt.getFullYear(), dt.getMonth(), dt.getDay(), '09', '00'],
				time ? rx.exec(time) : d.slice(0, 3).concat([dt.getHours(), dt.getMinutes()])];
	}
	
	// singelton instance
	return {
		transaction : function(){
			return new transaction();
		},
		
		query: singleQuery,
		
		// yyyy-MM-ddT00:00:00.000Z --> yyyy-m[m]-d[d] hh:mm:ss
		picker2db: function(date, time){
			var rx = /(\d{4})\-(\d{2})\-(\d{2})T(\d{2})\:(\d{2})/;
			var dt = parseDate(rx, date, time);
			var d = dt[0], t = dt[1];
			return [d[1], d[2], d[3]].join('-')+' '+[t[4], t[5]].join(':')+':00';
		},
		
		// yyyy-m[m]-d[d] hh:mm:ss --> yyyy-MM-ddT00:00:00.000Z
		db2picker: function(date, time){
			var rx = /(\d{4})\-(\d{1,2})\-(\d{1,2}) (\d{2})\:(\d{2})/;
			var dt = parseDate(rx, date, time);
			var d = dt[0], t = dt[1];
			return [d[1], ('00'+d[2]).slice(-2), ('00'+d[3]).slice(-2)].join('-')+'T'+[d[4], d[5]].join(':')+':00.000Z';
		},
		
		
	};
	
	
}]);
