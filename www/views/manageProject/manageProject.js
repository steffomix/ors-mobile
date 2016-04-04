angular.module('openRentstockApp').
controller('manageProjectCtrl', ['$scope', '$routeParams', 'orsDb' ,function($scope, $routeParams, db){

		var userId = $routeParams.id, d = new Date(), pad ='00',
		preDate = [d.getFullYear(), ('00'+d.getMonth()).slice(-2), ('00'+d.getDay()).slice(-2)].join('-')+'T09:00:00.000Z';
		
		$scope.rx = /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\.(\d{3})/.exec(preDate);
		$scope.project ={

			"id": 1,
			"name": "",
			"start": "2016-2-15 09:00:00",
			"end": "2016-3-8 09:00:00",
			"info": "YYYY-MM-DD HH:MM:SS",
			"chief": "",
			"cid": 0,
			"dateStart": preDate,
			"timeStart": preDate,
			"dateEnd": preDate,
			"timeEnd": preDate
		};


		$scope.mce = mce();

		// project
		db.query(
		['select p.*, chiefs.name as chief, chiefs.id as cid',
			'from projects as p',
			'join chiefs on p.id = chiefs.id',
			'where p.id = :id;'].join(' '),
		[['id', userId, 'int']], 
		function (data){
			var d = data.first(), 
				start = db.db2picker(d.start, d.start),
				end = db.db2picker(d.end, d.end);
			
			$scope.project = {
				id: d.id,
				name: d.name,
				chief: d.chief,
				cid: d.cid,
				dateStart: start,
				timeStart: start,
				dateEnd: end,
				timeEnd: end,
				info: d.info,
				start: data.start,
				end: data.end
			};
			
		}
		);

		// chiefs
		db.query('select id, name from chiefs', [], function(data){
			$scope.chiefs = data.all();
		});




	}]);

/*
  "id": 1,
  "name": "First try\r\n",
  "start": "2016-2-15 09:00:00",
  "end": "2016-3-8 09:00:00",
  "info": "YYYY-MM-DD HH:MM:SS",
  "chief": "Mr. Brown",
  "cid": 1,
  "dateStart": "2016-04-03T23:00:00.000Z",
  "timeStart": "1970-01-01T14:00:00.000Z",
  "dateEnd": "2016-04-13T23:00:00.000Z",
  "timeEnd": "1970-01-01T14:00:00.000Z"
*/
