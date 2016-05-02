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
		//$scope.isNow = isNow;

		$scope.paginate = {
			pageLength: 123
		};
		
		$timeout(function(){
			$scope.paginate.pageLength = 234;
		}, 5000);
		
		return;
		
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
			ds.setDate(ds.getDate() - 35);
			// set time to 00:00:00
			ds.setHours(0, 0, 0, 0);
			dateStart = ds;

			// dateEnd
			de = getNow();
			// goto sunday night this week + 180 days or a half year
			de.setDate(de.getDate() + 7 - de.getDay() + 1 + firstDay + 140);
			// set hour as late as possible
			de.setHours(23, 59, 59);
			dateEnd = de;

		}

		function renderEvents(events){
			if(!events){
				// create event first
				return $location.path('/manageEvent');
			}

			var mode, start, end, weekEnd, weeks = [], remove = [], rm;

			//walk through weeks
			for(var i = dateStart.getTime(); i <= dateEnd.getTime() + tWeek; i += tWeek){

				week = new Week(new Date(i));
				weeks.push(week);
				weekEnd = i + tWeek;

				for(var idx = 0; idx < events.length; idx++){
					evt = events[idx];
					start = Math.floor(evt.start / tDay) * tDay;
					end = Math.floor(evt.end / tDay) * tDay;
					mode = false;
					// this
					if(start >= i && end < weekEnd){ 
						mode = 'within';
					}
					// start
					if(start >= i && start < weekEnd && end >= weekEnd){
						mode = 'start';
					}
					// around
					if(start < i && end >= weekEnd){
						mode = 'around';
					}
					// end
					if(start < i && end >= i && end < weekEnd){
						mode = 'end';
					}

					if(mode){
						// add event to render
						week.addEvent(evt, mode);

						if(mode == 'one' || mode == 'end'){
							// add events for remove
							remove.push(idx);
						}
					}

					if(evt.start > weekEnd){
						// no more events for this week
						break;
					}
				}

				// remove events out of date
				while((rm = remove.pop())){
					events.splice(rm, 1);
				}
			}
			$anchorScroll.yOffset = 75;
			//$scope.weeks = weeks;
			applyCalendar(weeks);
			// scroll to current week


		}
		
		
		function applyCalendar(weeks){
			var w = weeks.shift();
			if(w){
				$timeout(function(){
					$scope.weeks.push(w);
					applyCalendar(weeks);
					if(w.isCurrentWeek(w.date)){
						$timeout(function(){
							$anchorScroll('current');
						}, 0);
					}
				}, 0);
			}
		}
		
		

		/*
		 week
		 */
		function Week(date){
			this.date = date;
			this.isCurrent = this.isCurrentWeek(date);
			this.days = this.addDays(date.getTime());
			this.events = [];
		}
		Week.prototype = {
			isCurrentWeek: function(date){
				var now = getNow();
				now.setDate(now.getDate() - firstDay);
				return $filter('date')(date, 'ww') == $filter('date')(now, 'ww');
			},
			addEvent: function(evt, mode){
				this.events.push(new Event(evt, mode));
			},
			addDays: function(t){
				var days = [];
				for(var i = 1; i <= 7; i++){
					days.push(new Day(new Date(t)));
					t += tDay;
				}
				return days;
			}
		};

		function Day(date){
			this.date = date;
		}
		Day.prototype = {
			isNow: function(){
				var t1 = '' + this.now.getFullYear() + this.now.getMonth() + this.now.getDate();
				return t1 == '' + this.date.getFullYear() + this.date.getMonth() + this.date.getDate();
			},
			now: getNow()
		};
		/*
		 event
		 */
		function Event(event, mode){
			// console.log(['Events', event, mode]);
			this.event = event;

			this.start = new Date(parseInt(event.start));
			this.end = new Date(parseInt(event.end));
			this.day = this.getDay(this.start);

			this.pre = this.day - 1;
			this.length =  this.getLength();
			this.fontColor = toolbox.brightness(event.color, true) ? '#00000ß' : '#ffffff';

			this.bars = {
				pre: 0,
				start: 1,
				length: 1,
				hasStart: true,
				hasEnd: true,
				borderColor: toolbox.darken(event.color, 30)
			};
			this.bars = this.processBars(mode);
		}
		Event.prototype = {
			processBars: function(mode){
				var b = {
					borderColor: toolbox.darken(this.event.color, 30)
				};
				if(mode == 'around'){
					b.pre = 0;
					b.start = 1;
					b.length = 7;
					b.hasStart = false;
					b.hasEnd = false;
				}else if(mode == 'within'){
					b.pre = this.day - 1;
					b.start = this.day;
					b.length = this.getLength() + 1;
					b.hasStart = true;
					b.hasEnd = true;
				}else if(mode == 'start'){
					b.pre = this.day - 1;
					b.start = this.day;
					b.length = this.getLength() + 1;
					b.hasStart = true;
					b.hasEnd = false;
				}else if(mode == 'end'){
					b.pre = 0;
					b.start = false;
					b.length = this.getDay(this.end);
					b.hasStart = false;
					b.hasEnd = true;
				}
				return b;
			},
			/*
			 Do not touch! :D
			 I have no clue how and why that works
			 cause its the result of try&fail and best example of
			 "never touch a running system"
			 */
			getDay: function(date){
				var day = date.getDay();
				if(day + firstDay < 0){
					day = 6 + day; // note: 7 + -day == 7 - (day * -1)
				}
				return day + (1 - firstDay);
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

