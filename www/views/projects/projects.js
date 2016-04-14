angular.module('openRentstockApp').
controller('projectsViewCtrl', 
['$scope', '$location', '$timeout', 'orsDb', 'toolbox', 
	function($scope , $location, $timeout, db, toolbox){
		var firstDay = 0, // 0 sunday, 1 monday
		dateStart,
		dateEnd, 
		tDay = 60 * 60 * 24 * 1000, 
		tWeek = tDay * 7;

		// prepare
		(function(){
			var d = new Date();
			$scope.weeks = [];

			// dateStart
			// goto monday morning this week
			d.setDate(d.getDate() - d.getDay() + 1 + firstDay);

			// set baseDate 21 days ago
			d.setDate(d.getDate() - 21);
			// set time to 00:00:00
			d.setHours(0, 0, 0, 0);
			dateStart = d;
			console.log(d.toJSON());
			// dateEnd
			d = new Date();
			// goto sunday night this week + 90 days
			d.setDate(d.getDate() + 7 - d.getDay() + 1 + 91);
			// set hour as late as possible
			d.setHours(23, 59, 59);
			dateEnd = d;

			load();
		})();

		function load(){
			db.query('select project by date range',
			[
				['tStart', dateStart.getTime(), 'string'],
				['tEnd', dateEnd.getTime(), 'string']
			],
			function(rows, response, querys){
				if(!rows){
					// create project first
					return $location.path('manageProject');
				}
				var dn = 1, day, mode, start, end, prj, weeks = [];
				// first week
				var week = new Week(dateStart);
				weeks.push(week);
				for(var i = dateStart.getTime(); i <= dateEnd.getTime(); i += tDay){
					day = new Date(parseInt(i));
					week.addDay(day);
					rows.all().forEach(function(r){
						start = Math.floor(r.start / tDay) * tDay;
						end = Math.floor(r.end / tDay) * tDay;
						mode = false;
						// this
						if(start >= i && end < i){ 
							mode = 'one';
						}
						// start
						if(start >= i && start < i + tDay && end > i + tDay){
							mode = 'start';
						}
						// around
						if(start < i && end > i + tDay){
							mode = 'around';
						}
						// end
						if(start < i && end >= i && end < i + tDay){
							mode = 'end';
						}

						if(mode){
							week.addProject(new Project(new Date(parseInt(i)), r), mode);
						}
					});
					if(new Date(i).getDay() == firstDay){
						week = new Week();
						weeks.push(week);
					}
				}

				weeks.forEach(function(w){
				 	w.prepare();
				});

				// attach weeks
				$scope.weeks = weeks;
			});



		}



		/*
		 week
		 */
		function Week(date){
			this.date = date;
			this.days = [];
			this.projects = [];
		}
		Week.prototype = {
			addProject: function(prj, mode){
				var isset = false;
				prj.setMode(mode);
				this.projects.forEach(function(p){
					if(prj.project.id == p.project.id){
						isset = true;
						p.setMode(mode);
					}
				});
				if(!isset){
					this.projects.push(prj);
				}
			},
			addDay: function(day){
				this.days.push(day);
			},
			prepare: function(){
				this.projects.forEach(function(p){
					p.processModes();
				});
			}
		};

		/*
		 project
		 */
		function Project(day, project, mode){
			this.start = new Date(parseInt(project.start));
			this.end = new Date(parseInt(project.end));
			this.day = this.getDay(this.start);
			this.mode = mode;

			var days = Math.floor(project.end / tDay) - Math.floor(this.start.getTime() / tDay);

			this.pre = this.day - 1;
			this.length =  Math.min(days, 7 - this.day);
			this.project = project;

			this.modes = {
				one: false,
				start: false,
				around: false,
				end: false
			};
		}
		Project.prototype = {
			getDay: function(start){
				var day = start.getDay() - 1;
				if(day < 0){
					day = 7 + day; // note: 6 + -n == 6 - (n * -1)
				}
				return day + 1;
			},
			setMode: function(mode){
				this.modes[mode] = mode;
			},
			processModes: function(){
				var m = this.modes;
				if(m.around && (m.one || m.start || m.end)){
					m.around = false;
				}
			}
		};
		/*
		 Week.prototype = {
		 addDay: function(day){
		 this.days.push(day);
		 },
		 // add filler-projects to prevent colapse
		 prepare: function(){
		 var day, project;
		 // fill forward

		 for(var d = 0; d < this.days.length; d++){
		 day = this.days[d];
		 for(var p = 0; p < day.projects.length; p++){
		 prj = day.projects[p];
		 // calculate display length
		 if(d == 0 || prj.mode == 2){
		 prj.days = Math.floor(day.date.getTime() / tDay) - Math.floor(prj.project.end / tDay);
		 prj.days = Math.max(6-d, prj.days);
		 }
		 // one day or end
		 if(prj.mode == 1 || prj.mode == 4){
		 // add filler
		 for(var df = d + 1; df < this.days.length; df++){
		 this.days[df].projects.splice(p, 0, new Project(0, 0));
		 }
		 }
		 }
		 }

		 // fill backward
		 for(var d = this.days.length - 1; d >= 0 ; d--){
		 day = this.days[d];
		 for(var p = day.projects.length - 1; p >= 0; p--){
		 prj = day.projects[p];
		 if(prj.mode == 1 || prj.mode == 2){
		 // add filler
		 for(var df = d - 1; df >= 0; df--){
		 this.days[df].projects.splice(p + 1, 0, new Project(0, 0));
		 }
		 }
		 }
		 }

		 }

		 };
		 */



		/*
		 modes:
		 0: empty filler
		 1: this day only
		 2: start this day
		 3: around this day
		 4: end this day
		 */
		function _Project(day, project, mode){
			// parent
			this.day = day;
			// display length
			this.days = 1;
			// db entry
			this.project = project;
			// mode (0-4)
			this.mode = mode;
			var d = new Date(parseInt(this.project.end));
			this.end = this.project ? d.getDate() + '.' + d.getMonth() : '-';
		}
		// edit project
		$scope.manageProject = function(id){
			$location.path('manageProject/' + id);
		};


		function getInt(i){
			return (isNaN(i) ? 1 : Math.abs(parseInt(i)));
		};

		function inArray(ar, nd){
			for(var i = 0; i < ar.length; i++){
				if(ar[i] == nd){
					return i;
				}
			}
			return false;
		}

		/*
		 function page(page){
		 page = getInt(page); // todo
		 var tr = db.transaction();

		 var q = tr.query("select projects");
		 tr.execute(function(rows){
		 var rows = rows.all();
		 rows.forEach(function(r, i){
		 rows[i]['start'] = toolbox.formatDate(r.start);
		 rows[i]['end'] = toolbox.formatDate(r.end);
		 rows[i]['iCol'] = '#' + (toolbox.brightness(rows[i]['color'], true) ? '000000' : 'FFFFFF');
		 });
		 $scope.projects = rows;
		 });
		 }
		 page(1);
		 */

	}]);

