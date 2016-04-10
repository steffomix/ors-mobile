angular.module('openRentstockApp')
.factory('orsDb', ['$http', '$q', '$timeout', 'orsQuerys', function($http, $q, $timeout, orsQuerys){

		/*
		 * example:
		 var tr = db.transaction();
		 var q = tr.query('select * from table where id = :id');
		 q.param('id', 1);
		 tr.execute(function(data){
		 // do stuff here
		 });
		 */

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
				var q = {query: orsQuerys[sql], params: []};
				querys.push(q);
				return new QuerySql(q.params);
			};

			this.execute = function(callback){
				var deferred = $q.defer();
				$http.post(url, querys).then(
				function(response){
					// console.log({orsDB_response: response});
					if(response.data.errorCode == undefined ||  parseInt(response.data.errorCode) != 0){
						console.error(
						{'sqLit3 Error' : response.data.errorCode + ': ' + response.data.errorText,
							'response' : response});
					}
					callback(new Result(response.data), response, querys);
				},
				function(response){
					console.error(response);
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

		/*
		
		*/
		function _findName(name, sql, field, model, key, callback, next){
			var i = 0, n;
			// remove old extensions
			if(!next){
				next = 0;
				name = name.trim();
				while ((i++) < 10 && name != (name = name.replace( /( *\([0-9]*\))$/, ''))){}
				
			}
			//console.log(name);
			// prepare next name
			n = next > 0 ? name  + ' (' + next + ')' : name;
			next ++;
			// query
			singleQuery(sql,[[field, n, 'string']],
			function(rows, data, querys){
				var exists = rows.first();
				// update view
				$timeout(function(){
					model[key] = 'Searching...: ' + n;
				}, 0);
				if(exists){
					// try next number
					_findName(name, sql, field, model, key, callback, next);
				}else{
					// return name
					$timeout(function(){
						model[key] = n;
					}, 0);
					callback(n);
				}
			}, function(data){
				console.error(data);
			}
			);
		}
		
		/*
		
		*/
		function singleQuery(sql, params, callback){
			var tr = new transaction(), q = tr.query(sql);
			params.forEach(function(p){
				p.length == 2 ? q.param(p[0], p[1], '') : q.param(p[0], p[1], p[2]);
			});
			tr.execute(callback);
		}
		
		// singelton instance
		return {
			
			transaction : function(){
				return new transaction();
			},

			/*
			example:
			db.query(
				'queryname', 
				[['id', 123, 'int']], 
				function(Result, response, querys){...}
				
			Result:
				result.first()
					first row or false
				result.all()
					all rows or false
				result.next()
					next row or false
				result.reset() 
					set cursor to first row
			);
			*/
			query: singleQuery,
			
			/*
				adds (n) number to existing entry
				name: where the (n) will be added
				sql: query name
				field: column to search on
				params: params for qery
				model: form model from $scope -> yes,the search is shown life
				key: key of the model
			
				example:
				db.findName('my project', 'name', $scope.project, 'pname', function(awesomeName){... your stuff ...});
			*/
			findName: function(name, sql, field, model, key, callback){
				_findName(name, sql, field, model, key, callback);
			}
		};
	}]);
	
	
		
		/*
		
		//adds ascending ' (n)' to name if exists
		function findName(sql, params, name, key, model, callback, next){
			var i = 0, n;
			// remove old extensions
			if(!next){
				next = 0;
				name = name.trim();
				while ((i++) < 10 && name != (name = name.replace( /( *\([0-9]*\))$/, ''))){}
				
			}
			console.log(name);
			// prepare next name
			n = next > 0 ? name  + ' (' + next + ')' : name;
			next ++;
			// query
			singleQuery(sql,[[key, n, 'string']].concat(params),
			function(rows, data, querys){
				var exists = rows.first();
				// update view
				$timeout(function(){
					model[key] = n + ' [already exists...]';
				}, 0);
				if(exists){
					// try next number
					findName(sql, params, name, key, model, callback, next);
				}else{
					// return name
					$timeout(function(){
						model[key] = n;
					}, 0);
					callback(n);
				}
			}, function(data){
				console.error(data);
			}
			);
		}

*/
