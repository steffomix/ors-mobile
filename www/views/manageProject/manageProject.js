angular.module('openRentstockApp').
controller('manageProjectCtrl', ['$scope', '$routeParams', 'orsDb', 'date', function($scope, $routeParams, db, date){

		var userId = parseInt($routeParams.id), d = date.dateToPicker(new Date(),'09','00');
		
		// setup tinymce
		$scope.mce = mce();
		
		// form mode, (update or copy) or create
		$scope.update = userId ? true : false;
		
		//form default data;
		$scope.project ={
			"id": 1,
			"name": "",
			"start": d,
			"end": d,
			"info": "",
			"chief": "",
			"cid": 0, // chiefId
			"dateStart": d,
			"timeStart": d,
			"dateEnd": d,
			"timeEnd": d
		};

		// load project
		db.query('select project', [['id', userId, 'int']], 
		function (data){
			var d = data.first(), 
				start = date.dbToPicker(d.start),
				end = date.dbToPicker(d.end);
				
			$scope.date = [start, end];
			
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

		// load all chiefs
		db.query('select chiefs', [], function(data){
			$scope.chiefs = data.all();
		});

		
		$scope.leaveChanged = function(e){
			console.log(e);
		};


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
