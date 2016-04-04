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
	
	return {
		transaction : function(){
			return new transaction();
		},
		
		query: singleQuery,
		
		/*
		dateTime to db: ['tt.mm.yyyy', 'hh:mm'] --> 'yyyy-mm-tt hh-mm-ss'
		db to dateTime: 'yyyy-mm-tt hh-mm-ss' --> ['tt.mm.yyyy', 'hh:mm'] 
		*/
		dateTime: function(date, time){
			var d, t;
			if(isArray(date)){
				return date[0].split('.').reverse().join('-')+' '+date[1]+':00';
			}else{
				d = date.split(' ');
				t = d[1].split(':');
				return [d[0].split('-').reverse().join('.'), t[0]+':'+t[1]];
			}
		}
		
		
	};
	
	
}]);
