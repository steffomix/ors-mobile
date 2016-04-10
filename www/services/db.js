angular.module('openRentstockApp')
.factory('orsDb', ['$http', '$timeout', 'orsQuerys', function($http, $timeout, orsQuerys){

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
				$http.post(url, querys).then(
				function(data){
					// console.log({orsDB_response: data});
					if(data.data.errorCode == undefined ||  parseInt(data.data.errorCode) != 0){
						console.error(
						{'sqLit3 Error' : data.data.errorCode + ': ' + data.data.errorText,
							'response' : data});
					}
					callback(new Result(data.data), data, querys);
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


		function singleQuery(sql, params, callback, customSql){
			var tr = new transaction(), q = tr.query(sql, customSql);
			params.forEach(function(p){
				p.length == 2
				? q.param(p[0], p[1], '')
				: q.param(p[0], p[1], p[2]);
			});
			tr.execute(callback);
		}

		/*
		adds ascending ' (n)' to name if exists
		*/
		function findName(sql, name, key, model, callback, next){
			// remove old extensions
			if(!next){
				next = 0;
				name.trim().replace(/(\([0-9]*\))$/, '');
			}
			// prepare next name
			n = next > 0 ? name  + ' (' + next + ')' : name;
			next ++;
			// query
			singleQuery(sql,[['name', n, 'string']],
			function(rows, data, querys){
				var exists = rows.first();
				// update view
				$timeout(function(){
					model[key] = n;
				}, 0);
				if(exists){
					// try next number
					findName(sql, name, key, model, callback, next);
				}else{
					// return name
					callback(n);
				}
			}, function(data){
				console.error(data);
			}
			);
		}


		// singelton instance
		return {
			transaction : function(){
				return new transaction();
			},

			query: singleQuery,

			findName: findName
		};
	}]);
