angular.module('openRentstockApp').
controller('manageProjectCtrl', ['$scope', '$routeParams', '$alert', '$timeout', 'orsDb', 'date', function($scope, $routeParams, $alert, $timeout, db, date){

		var projectId = parseInt($routeParams.id);

		// form mode, update and copy or create
		$scope.isUpdate = projectId ? true : false;

		// set default values
		initForm();

		// setup tinymce
		$scope.mce = mce();

		/*
		 init default values
		 */
		function initForm(){
			var d = new Date();
			d.setMinutes(Math.round(d.getMinutes() / 10) * 10);
			$scope.project = {
				id: '',
				name: '',
				start: d,
				end: d,
				info: '',
				chief: '',
				cid: 1, // chiefId
				dateStart: d,
				timeStart: d,
				dateEnd: d,
				timeEnd: d,
				active: true
			};
		}
		/*
		 load
		 */
		if(projectId){
			db.query('select project', [['id', projectId, 'int']], 
			function (rows, data, querys){
				var r = rows.first(), s = new Date(), e = new Date();
				s.setTime(r.start);
				roundMinutes(s);
				e.setTime(r.end);
				roundMinutes(e);
				$scope.project = {
					// project
					id: 	r.id,
					name: 	r.name,
					start: 	s,
					end: 	e,
					info: 	r.info,
					// chief
					cid: 	r.cid,
					chief: 	r.chief,
					// date-timepicker helper
					dateStart: 	s,
					timeStart: 	s,
					dateEnd: 	e,
					timeEnd: 	e,
					// state
					active: r.active ? true : false,
					// new name for copy
					copyName: r.name
				};
			});
		}

		/*
		 load chiefs for pulldown
		 */
		db.query('select chiefs', [], function(data){
			$scope.chiefs = data.all();
		});


		/*
		 update
		 */
		$scope.update = function(){
			if(!$scope.form.$valid){
				return $alert({content: 'Please re-check your Project Data.', type: 'danger'});
			}
			var p = $scope.project;
			db.query('update project', 
			[
				['id', projectId, 'int'],
				['name', p.name, 'string'],
				['chief', p.cid, 'int'],
				['start', tStart().getTime(), 'string'],
				['end', tEnd().getTime(), 'string'],
				['info', p.info, 'string'],
				['active', p.active, 'int']

			],
			function(rows, data, querys){
				$alert({content: 'Project updated', type: 'success'});
			});
		};

		/*
		 create
		 */
		$scope.create = function(name){
			if(!$scope.form.$valid){
				return $alert({content: 'Please re-check your Project Data.', type: 'danger'});
			}
			if(!name){
				return db.findName('select project by name', $scope.project.name, 'name', $scope.project, $scope.create);
				return findName($scope.project.name, $scope.create, $scope.project);
			}
			var p = $scope.project;


			$timeout(function(){
				p.name = name;
				p.dateStart = new Date();
			}, 1);

			alert(name);

			return;
			db.query('create project', 
			[
				['name', name, 'string'],
				['chief', p.cid, 'int'],
				['start', tStart().getTime(), 'string'], // int is too short
				['end', tEnd().getTime(), 'string'], // int is too short
				['info', p.info, 'string'],
				['active', p.active, 'int']

			],
			function(rows, data, querys){
				console.log([rows, data, querys]);
				$alert({ title: '', content: 'Project created', type: 'success'});
			});
		};

		/*
		 copy
		 */
		$scope.copyProject = function(){

		};

		/*
		 start changed
		 */
		$scope.startChanged = function(isDate){
			$timeout(function(){
				if(tStart().getTime() > tEnd().getTime()){
					$scope.project.dateEnd = $scope.project.timeEnd = tStart();
				}},
			0);
		};

		/*
		 end changed
		 */
		$scope.endChanged = function(isDate){
			$timeout(function(){
				if(tStart().getTime() > tEnd().getTime()){
					$scope.project.dateStart = $scope.project.timeStart = tEnd();
				}},
			0);
		};

		
		/*
		 find project-name
		 */
		function findName(name, callback, next){
			// remove old extensions
			if(!next){
				next = 0;
				name.trim().replace(/(\([0-9]*\))$/, '');
			}
			// prepare next name
			n = next > 0 ? name  + ' (' + next + ')' : name;
			next ++;
			// query
			db.query('select project by name', [['name', n, 'string']],
			function(rows, data, querys){
				console.log(data);
				var exists = rows.first();
				// update view
				$timeout(function(){
					$scope.project.name = n;
				},0);
				// 
				if(exists){
					findName(name, callback, next);
				}else{
					callback(n);
				}
			}, function(data){
				console.error(data);
				}
			);
		}

		/*
		 combine date and time for start
		 */
		function tStart(end){
			var t = new Date(), f = $scope.project,
			ds = f.dateStart, ts = f.timeStart,
			de = f.dateEnd,   te = f.timeEnd;
			if(!end){
				t.setFullYear(ds.getFullYear(), ds.getMonth(), ds.getDate(),ts.getHours(), ts.getMinutes(), 0, 0);
				t.setHours(ts.getHours(), ts.getMinutes(), 0, 0);
			}else{
				t.setFullYear(de.getFullYear(), de.getMonth(), de.getDate());
				t.setHours(te.getHours(), te.getMinutes(), 0, 0);
			}
			return roundMinutes(t);
		}

		/*
		 combine date and time for end
		 */

		function tEnd(){
			return tStart(true);
		}

		/*
		 round minutes
		 */
		function roundMinutes(d){
			return d;
			d.setMinutes(Math.round(d.getMinutes() / 10) * 10);
			return d;
		}

	}]);


