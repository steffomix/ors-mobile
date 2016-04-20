angular.module('openRentstockApp').controller('eventsViewCtrl', 
['$scope', '$http', '$q', '$location', '$anchorScroll', '$timeout', '$filter', '$modal', 'orsDb', 'toolbox', 
	function($scope, $http, $q, $location, $anchorScroll, $timeout, $filter, $modal, db, toolbox){

		// do not use directly
		// use getNow()
		var now = new Date();
		// 0 sunday, 1 monday
		var firstDay = 1;
		// start of calendar
		var dateStart;
		// end of calendar
		var dateEnd;
		// length of day in ms
		var tDay = 60 * 60 * 24 * 1000;
		// lenth of week
		var tWeek = tDay * 7;
		// preload searchform
		var searchModal = $modal({templateUrl: 'views/events/event-search.tpl.html', scope:$scope, show: false});
		// scope
		$scope.chiefs = [];
		$scope.weeks = [];
		$scope.search = {
			name: 'event',
			cid: 0,
			item: 'item'
		};
		// events
		$scope.onClickSearchModal = onClickSearchModal;
		$scope.onClickEvent = onClickEvent;
		$scope.isNow = isNow;

		// load data and render event calentar
		$q.all([db.query('select chiefs', []), loadEvents()]).then(
		function(response){
			// update chiefs
			var chiefs = response[0].all(), ign = {id: 0, name: 'Ignore'};
			if(chiefs){
				chiefs.unshift(ign);
				$scope.chiefs = chiefs;
			}else{
				$scope.chiefs = [ign];
			}
			// render calendar
			renderEvents(response[1].all());
		}, 
		function(e){
			console.error(e);
		});


		function onClickSearchModal(){
			searchModal.$promise.then(searchModal.show);
		};

		function onClickEvent(id){
			$location.path('manageEvent/' + id);
		};

		/*
		 date depending on hash request
		 */
		function getNow(){
			var g = $location.search();
			return new Date(now);
		}		




		function isNow(d){
			var t1 = '' + now.getFullYear() + now.getMonth() + now.getDate();
			return t1 == '' + d.getFullYear() + d.getMonth() + d.getDate();
		};


		function loadEvents(){
			calcDateRange();
			return db.query('select event by date range',
			[
				['tStart', dateStart.getTime(), 'string'],
				['tEnd', dateEnd.getTime(), 'string']
			]);
		}

		function calcDateRange(){
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

		}

		function renderEvents(events){
			if(!events){
				// create event first
				return $location.path('/manageEvent');
			}
			
			var day, mode, start, end, weeks = [], dayMap = {};
			/*
			//walk through weeks
			for(var i = dateStart.getTime(); i <= dateEnd.getTime() + tWeek; i += tWeek){

				day = new Date(parseInt(i));
				dayMap['d'+i] = day();
				if(day.getDay() == firstDay){

					week = new Week(new Date(i + tDay));
					weeks.push(week);
				}
				week.addDay(day);
			}
			
			*/
			 
			
			
			
			
			
			
			
			

			
			// walk through days 
			for(var i = dateStart.getTime(); i <= dateEnd.getTime(); i += tDay){

				day = new Date(parseInt(i));

				if(day.getDay() == firstDay){

					week = new Week(new Date(i + tDay));
					weeks.push(week);
				}
				week.addDay(day);

				events.forEach(function(r){
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
						week.addEvent(new Event(r), mode);
					}
				});

			}

			// prepare data for scope
			weeks.forEach(function(w){
				w.prepare();
			});
			// attach weeks to scope
			$scope.weeks = weeks;

			// scroll to current week
			$timeout(function(){
				$anchorScroll.yOffset = 75;
				$anchorScroll('current');
			}, 0);
		}

		/*
		 week
		 */
		function Week(date){
			this.date = date;
			this.isCurrent = this.isCurrentWeek(date);
			this.days = [];
			this.events = [];
		}
		Week.prototype = {
			isCurrentWeek: function(date){
				var now = getNow();
				now.setDate(now.getDate() - firstDay);
				return $filter('date')(date, 'ww') == $filter('date')(now, 'ww');
			},
			addEvent: function(evt, mode){
				var isset = false;
				evt.setMode(mode);
				this.events.forEach(function(e){
					if(evt.event.id == e.event.id){
						isset = true;
						e.setMode(mode);
					}
				});
				if(!isset){
					this.events.push(evt);
				}
			},
			addDay: function(day){
				this.days.push(day);
			},
			prepare: function(){
				this.events.forEach(function(e){
					e.processModes();
					e.processBars();
				});
			}
		};
		
		/*
		 event
		 */
		function Event(event){
			this.event = event;
			this.start = new Date(parseInt(event.start));
			this.end = new Date(parseInt(event.end));
			this.day = this.getDay(this.start);

			this.pre = this.day - 1;
			this.length =  this.getLength();
			this.fontColor = toolbox.brightness(event.color, true) ? '#00000ß' : '#ffffff';

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
				borderColor: toolbox.darken(event.color, 30)
			};
		}
		Event.prototype = {
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
					b.pre = this.day - 1;
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
			getDay: function(date){
				var day = date.getDay() - 1;
				if(day + (1 - firstDay) < 0){
					day = 7 + day; // note: 7 + -day == 7 - (day * -1)
				}
				return day + (2 - firstDay);
			},
			getLength: function(){
				var days = Math.floor(this.event.end / tDay) - Math.floor(this.start.getTime() / tDay);
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




	}]);

