angular.module('openRentstockApp').
controller('projectsViewCtrl', 
	['$scope', '$location', '$timeout', 'orsDb', 'toolbox', 
	function($scope ,$location, $timeout, db, toolbox){
		var dateStart, dateEnd, tDay = 60*60*24*1000, tWeek = tDay * 7;
		
		// prepare
		(function(){
			var d = new Date();
			$scope.weeks = [];
			
			// dateStart
			// goto monday morning this week
			d.setDate(d.getDate() - d.getDay() + 1);
			// set baseDate 21 days ago
			d.setDate(d.getDate() - 21);
			// set time to 00:00:00
			d.setHours(0, 0, 0, 0);
			dateStart = d;
			
			// dateEnd
			d = new Date();
			// goto sunday night this week + 90 days
			d.setDate(d.getDate() + 7 - d.getDay() + 91);
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
				var day, mode;
				// dayNumber
				var dn = 1;
				// weeks container
				var weeks = [];
				// first week
				var week = new Week(dateStart);
				weeks.push(week);
				for(var i = dateStart.getTime(); i <= dateEnd.getTime(); i += tDay){
					
					day = new Day(new Date(i));
					week.addDay(day);
					rows.all().forEach(function(r){
						mode = 0;
						// this
						if(r.start > i && r.end < i + tDay){ 
							mode = 1;
						}
						// start
						if(r.start > i && r.start < i + tDay && r.end > i + tDay){
							mode = 2;
						}
						// around
						if(r.start < i && r.end > i + tDay){
							mode = 3;
						}
						// end
						if(r.start < i && r.end > i && r.end < i + tDay){
							mode = 4;
						}
						
						if(mode > 0){
							day.addProject(new Project(r, mode));
						}
					});
					
					dn ++;
					if(dn > 7){
						dn = 1;
						week = new Week();
						weeks.push(week);
					}
				}
				weeks.forEach(function(w){
					w.prepare();
				});
				//$timeout(function(){
					$scope.weeks = weeks;
				//}, 0);
				console.log(weeks[0]);
			});
			
			
			
		}
		
		
		
		function Week(date){
			this.class='Week';
			this.date = date;
			this.days = [];
			
		}
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
						if(prj.mode == 1 || prj.mode == 4){
							// add filler
							for(var df = d + 1; df < this.days.length; df++){
								this.days[df].projects.splice(p+1, 0, new Project(0, 0));
							}
						}
					}
				}
				/*
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
				*/
			}
			
		};
		
		
		
		function Day(date){
			this.class = 'Day';
			this.date = date;
			this.projects = [];
		}
		Day.prototype = {
			addProject: function(project){
				this.projects.push(project);
			}
		};
		/*
		 modes:
		 	0: empty filler
		 	1: this day only
			2: start this day
			3: around this day
			4: end this day
		*/
		function Project(project, mode){
			this.class='Project';
			this.project = project;
			this.mode = mode;
		}
		// edit project
		$scope.manageProject = function(id){
			$location.path('manageProject/'+id);
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

