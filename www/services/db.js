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
		
		function _query(params){
			this.param = function(key, value, type){
				params.push({key:key, value:value, type:type});
				return this;
			};
		}
		
		this.query = function(sql){
			var q = {query: sql, params: []};
			querys.push(q);
			return new _query(q.params);
		};
		
		this.execute = function(callback){
			
			$http.post(url, querys).then(
				function(data){
					console.log({orsDB_response: data});
					if(data.data.errorCode){
						console.error('orsDB-error '+data.data.errorCode+': '
						+ data.data.errorText);
					}
					callback(data.data);
				},
				function(e){
					console.error(e);
				}
			);
		};
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
		
		query: singleQuery
	};
	
	
}]);