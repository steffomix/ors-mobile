angular.module('openRentstockApp').
controller('projectsViewCtrl', 
['$scope', '$location', '$anchorScroll', '$timeout', '$filter', 'orsDb', 'toolbox', 
	function($scope , $location, $anchorScroll, $timeout, $filter, db, toolbox){
		var now = new Date(),
		// 0 sunday, 1 monday
		firstDay = 1, 
		// start of calendar
		dateStart,
		// end of calendar
		dateEnd, 
		// length of day in ms
		tDay = 60 * 60 * 24 * 1000,
		// lenth of week
		tWeek = tDay * 7;
		
		$scope.weeks = [];
		
		eventCalendar();
		
		
		function getNow(){
			var g = $location.search();
			
			return new Date(now.getTime());
		}		

		function eventCalendar(){
			var ds, de;
			ds = getNow();
			
			// dateStart
			// goto monday morning this week
			ds.setDate(ds.getDate() - ds.getDay() + firstDay);
			// set baseDate some days ago
			ds.setDate(ds.getDate() - 70);
			// set time to 00:00:00
			ds.setHours(0, 0, 0, 0);
			dateStart = ds;
			
			// dateEnd
			de = getNow();
			// goto sunday night this week + 180 days or a half year
			de.setDate(de.getDate() + 7 - de.getDay() + 181 + firstDay);
			// set hour as late as possible
			de.setHours(23, 59, 59);
			dateEnd = de;
			db.query('select project by date range',
			[
				['tStart', dateStart.getTime(), 'string'],
				['tEnd', dateEnd.getTime(), 'string']
			],
			function(rows, response, querys){
				if(!rows){
					// create project first
					return $location.path('/manageProject');
				}
				var day, mode, start, end, weeks = [];
				// walk through days 
				for(var i = dateStart.getTime(); i <= dateEnd.getTime(); i += tDay){
					
					day = new Date(parseInt(i));
					
					if(day.getDay() == firstDay){
						
						week = new Week(new Date(i + tDay));
						weeks.push(week);
					}
					week.addDay(day);
					
					rows.all().forEach(function(r){
						start = Math.floor(r.start / tDay) * tDay;
						end = Math.floor(r.end / tDay) * tDay;
						mode = false;
						// this
						if(start >= i && end < i + tDay){ 
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
							week.addProject(new Project(r), mode);
						}
					});
					
				}

				weeks.forEach(function(w){
				 	w.prepare();
				});

				// attach weeks
				$scope.weeks = weeks;
				$timeout(function(){
					//$location.hash('current');
					$anchorScroll.yOffset = 75;
					$anchorScroll('current');
				}, 100);
			});
		}

		/*
		 week
		 */
		function Week(date){
			this.date = date;
			this.current = $filter('date')(date, 'ww') == $filter('date')(now, 'ww');
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
					p.processBars();
				});
			}
		};

		/*
		 project
		 */
		function Project(project){
			this.project = project;
			this.start = new Date(parseInt(project.start));
			this.end = new Date(parseInt(project.end));
			this.day = this.getDay(this.start);

			this.pre = this.day - 1;
			this.length =  this.getLength();
			this.fontColor = toolbox.brightness(this.project.color, true) ? '#00000ß' : '#ffffff';

			this.modes = {
				one: 0,
				start: 0,
				around: 0,
				end: 0
			};
			
			this.bars = {
				pre: 0,
				start: 1,
				length: 1,
				hasStart: true,
				hasEnd: true,
				borderColor: toolbox.darken(this.project.color, 30)
			};
		}
		Project.prototype = {
			processBars: function(){
				var m = this.modes, b = this.bars;
				if(m['one']){
					b.start = this.day;
					b.length = 1;
					b.hasStart = true;
					b.hasEnd = true;
					b.pre = this.day - 1;
				}else if(m['around']){
					b.start = 1;
					b.length = 7;
					b.hasStart = false;
					b.hasEnd = false;
					b.pre = 0;
				}else if(m['start'] && m['end']){
					b.start = this.day;
					b.length = this.getLength() + 1;
					b.hasStart = true;
					b.hasEnd = true;
					b.pre = this.day - 1;
				}else if(m['start'] && !m['end']){
					b.start = this.day;
					b.length = this.getLength() + 1;
					b.hasStart = true;
					b.hasEnd = false;
					b.pre = this.day -1;
				}else if(!m['start'] && m['end']){
					b.start = false;
					b.length = this.getDay(this.end);
					b.hasStart = false;
					b.hasEnd = true;
					b.pre = 0;
				}
			},
			/*
			 Do not touch! :D
			 I have no clue how and why that works
			 cause its the result of try&fail and best example of
			 "never touch a running system"
			*/
			getDay: function(day){
				var day = day.getDay() - 1;
				if(day + (1 - firstDay) < 0){
					day = 7 + day; // note: 7 + -day == 7 - (day * -1)
				}
				return day + (2 - firstDay);
			},
			getLength: function(){
				var days = Math.floor(this.project.end / tDay) - Math.floor(this.start.getTime() / tDay);
				return Math.min(days, 7 - this.day);
			},
			setMode: function(mode){
				this.modes[mode] = mode;
			},
			processModes: function(){
				var m = this.modes;
				if(m.around && (m.one || m.start || m.end)){
					m.around = false;
				}
				if(m.one){
					m.start = m.end = m.around = false;
				}
			}
		};
		
		// edit project
		$scope.onEdit = function(id){
			$location.path('manageProject/' + id);
		};

		$scope.isNow = function(d){
			var t1 = '' + now.getFullYear() + now.getMonth() + now.getDate();
			return t1 == '' + d.getFullYear() + d.getMonth() + d.getDate();
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

	}]);

