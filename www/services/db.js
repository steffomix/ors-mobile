angular.module('openRentstockApp')
.factory('orsDb', ['$http', '$q', '$timeout', 'orsQuerys', function($http, $q, $timeout, orsQuerys){

		

		function Transaction(){

			var querys = [],
			url = 'db/db-query.php';

			function QuerySql(params){
				this.param = function(key, value, type){
					params.push({key:key, value:value, type:type});
					return this;
				};
			}

			this.query = function(sql){
				var q = {query: orsQuerys[sql], params: []};
				querys.push(q);
				return new QuerySql(q.params);
			};

			this.execute = function(callback){
				if(callback){
					executeWithCallback(callback);
				}else{
					return executeWithPromise();
				}
			};

			function executeWithCallback(callback){
				$http.post(url, querys).then(
				function(response){
					if(checkResponse(response)){
						// callback all data
						callback(new Result(response.data), response, querys);
					}else{
						// callback empty Result
						callback(new Result({result: []}));
					}
				},
				function(response){
					console.error(response);
					callback(new Result({result: []}));
				});
			}

			function executeWithPromise(){
				var defer = $q.defer();
				$http.post(url, querys).then(
				function(response){
					if(checkResponse(response)){
						// return data as expected
						defer.resolve(new Result(response.data), response, querys);
					}else{
						// try to not break the app and return empty result
						defer.resolve(new Result({result: []}));
					}
				},
				function(response){
					// reject with empty result
					console.error(response);
					defer.reject(new Result({result: []}));
				});
				return defer.promise;
			}

			function checkResponse(response){
				if(response.statusText.toUpperCase() != 'OK'){
					console.error(
					{'HTTP Error' : response.data.errorCode + ': ' + response.data.errorText, 'response' : response}
					);
					return false;
				}else if(parseInt(response.data.errorCode) != 0){
					console.error(
					{'SqLite Error' : response.data.errorCode + ': ' + response.data.errorText, 'response' : response}
					);
					return false;
				}
				return true;
			}
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
					return false;
				}
			};

			this.all = function(){
				return rows;
			};

			this.reset = function(){
				cursor = 0;
			};
		}


		/*

		 */
		function singleQuery(sql, params, callback){
			var tr = new Transaction(), q = tr.query(sql);
			if(params){
				params.forEach(function(p){
					p.length == 2 ? q.param(p[0], p[1], '') : q.param(p[0], p[1], p[2]);
				});
			}
			return tr.execute(callback);
		}

		// singelton instance
		return {
			/*
		 	example:
		 		var tr = db.transaction();
		 		var q = tr.query('select * from table where id = :id');
		 		q.param('id', 1);
		 		tr.execute(function(Result, data, querys){
		 			// do stuff here
		 		});
				or: promise = tr.execute();
		 	*/
			transaction : function(){
				return new Transaction();
			},

			/*
			example:
				db.query('queryname' [, [['id', 123, 'int']] [,  function(Result, response, querys){...} ]]);
				or:
				promise = db.query(...);
				Result:
				result.first() first row or false
				result.all() all rows or false
				result.next() next row or false
				result.reset() set cursor to first row
			*/
			query: singleQuery,

		};
	}]);

