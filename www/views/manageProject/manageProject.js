angular.module('openRentstockApp').
controller('manageProjectCtrl', 
['$scope', '$routeParams', '$alert', '$timeout', 'orsDb', 'toolbox', 
	function($scope, $routeParams, $alert, $timeout, db, toolbox){

		var projectId, jsc, txtColor, elColor = angular.element(document.querySelector('#project-color'));

		/*
		 init view values
		 */
		(function(){
			var d = roundMinutes(new Date());
			// form mode, update and copy or create
			projectId = parseInt($routeParams.id);
			$scope.isUpdate = projectId ? true : false;
			releaseForm();

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
						// color
						color: r.color,
						// new name for copy
						copyName: r.name
					};
					initCp(r.color);
					setColor(r.color);
				});
			}else{
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
					active: true,
					color: 'cccccc'
				};
				initCp($scope.project.color);
				setColor($scope.project.color);


			}

			/*
			 load chiefs for pulldown
			 */
			db.query('select chiefs', [], function(data){
				$scope.chiefs = data.all();
			});


		})();

		/*  
		 update
		 */
		$scope.onUpdate = function(){
			// lock form
			lockForm();
			if(!projectId){return;}
			if(!$scope.form.$valid){
				// unlock form
				releaseForm();
				return $alert({content: 'Please re-check your Project Data.', type: 'danger'});
			}
			// check project exists
			db.query('project exists update', 
			[['id', projectId, 'int'],['name', $scope.project.name, 'string']],
			function(rows){
				if(rows.first()){
					// unlock form
					releaseForm();
					return $alert({content: 'Project Name is already in use', type: 'danger' });
				}
				// update
				var p = $scope.project;
				db.query('update project', 
				[
					['id', projectId, 'int'],
					['name', p.name, 'string'],
					['chief', p.cid, 'int'],
					['start', tStart().getTime(), 'string'],
					['end', tEnd().getTime(), 'string'],
					['info', p.info, 'string'],
					['active', p.active, 'int'],
					['color', p.color, 'string']
				],
				// unlock form
				function(rows, data, querys){
					releaseForm();
					$alert({content: 'Project updated', type: 'success'});
				});
			});
		};

		/*
		 create
		 */
		$scope.onCreate = function(){
			// lock form
			lockForm();
			if(projectId){return;}
			if(!$scope.form.$valid){
				// unlock form
				releaseForm();
				return $alert({content: 'Please re-check your Project Data.', type: 'danger'});
			}
			// check project exists
			db.query('project exists create', 
			[['name', $scope.project.name, 'string']],
			function(rows){
				if(rows.first()){
					// unlock form
					releaseForm();
					return $alert({content: 'Project Name is already in use', type: 'danger' });
				}else if(confirm('Create new Project?')){
					// update
					var p = $scope.project;
					db.query('create project', 
					[
						['name', $scope.project.name, 'string'],
						['chief', p.cid, 'int'],
						['start', tStart().getTime(), 'string'], // int is too short
						['end', tEnd().getTime(), 'string'], // int is too short
						['info', p.info, 'string'],
						['active', p.active, 'int'],
						['color', p.color, 'string']
					],
					function(rows, data, querys){
						// unlock form
						releaseForm();
						$alert({ title: '', content: 'Project created', type: 'success'});
					});
				}else{
					releaseForm();
				}
			});
		};

		/*
		 copy
		 */
		$scope.onCopy = function(){
			lockForm();
			if(!$scope.copy.$valid || !$scope.form.$valid){
				// unlock form
				releaseForm();
				return $alert({content: 'Please re-check your Project Data.', type: 'danger'});
			}
			if(confirm('Create new Project?')){
				db.findName(
				$scope.project.name, 
				'project exists create', 
				'name', 
				$scope.project, 
				'copyName', 
				function copy(name){
					alert(name);
					releaseForm();
				});
			}else{
				releaseForm();
			}
		};

		/*
		 lock and unlock form
		 */
		function lockForm(){
			$scope.isLoading = true;
		}
		function releaseForm(){
			$scope.isLoading = false;
		}

		/*
		 date start changed
		 */
		$scope.startChanged = function(isDate){
			$timeout(function(){
				if(tStart().getTime() > tEnd().getTime()){
					$scope.project.dateEnd = $scope.project.timeEnd = tStart();
				}},
			0);
		};

		/*
		 date end changed
		 */
		$scope.endChanged = function(isDate){
			$timeout(function(){
				if(tStart().getTime() > tEnd().getTime()){
					$scope.project.dateStart = $scope.project.timeStart = tEnd();
				}},
			0);
		};

		/*
		 combine date and time for start
		 */
		function tStart(end){
			var t = new Date(), f = $scope.project,
			ds = f.dateStart, ts = f.timeStart,
			de = f.dateEnd,   te = f.timeEnd;
			if(!end){
				t.setFullYear(ds.getFullYear(), ds.getMonth(), ds.getDate(), ts.getHours(), ts.getMinutes(), 0, 0);
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
			d.setMinutes(Math.round(d.getMinutes() / 10) * 10);
			return d;
		}

		function setColor(c){
			elColor.css('background-color', '#' + c);
			txtColor = toolbox.brightness($scope.project.color) < 128 ? 'ffffff' : '000000';
		}

		/*
		 colorjs
		 */
		function initCp(color){
			$scope.jsc = new jscolor(document.getElementById('project-color'), {
				valueElement:'project-color', 
				styleElement:'btn-project-color',
				value: color,
				width: 221,
				height: 181,
				shadowBlur: 7,
				shadowColor: 'rgba(0,0,0,0.14)',
				onFineChange: function(){
					elColor.css('color', txtColor);
				}
				
				}
			);
		}
	}]);


