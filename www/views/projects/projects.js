angular.module('openRentstockApp').
controller('projectsViewCtrl', 
['$scope', '$location', '$timeout', 'orsDb', 'toolbox', 
	function($scope , $location, $timeout, db, toolbox){
		var now = new Date(), 
		firstDay = 0, // 0 sunday, 1 monday
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
			
			// dateEnd
			d = new Date();
			// goto sunday night this week + 90 days
			d.setDate(d.getDate() + 7 - d.getDay() + 1 + 181);
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
				var day, mode, start, end, prj, weeks = [];
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
							week.addProject(new Project(r), mode);
						}
					});
					if(new Date(i).getDay() == firstDay){
						week = new Week(new Date(i + tDay));
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
					b.length = this.getLength();
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
			getDay: function(day){
				var day = day.getDay() - 1;
				if(day < 0){
					day = 7 + day; // note: 6 + -n == 6 - (n * -1)
				}
				return day + 1;
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

