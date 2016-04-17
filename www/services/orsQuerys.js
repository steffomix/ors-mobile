angular.module('openRentstockApp')
.factory('orsQuerys', function($http){
	
	return {
		/*
		manage event
		*/
		// select events
		'select events': 
			'SELECT * FROM events ORDER BY start DESC',
		//
		'select event by date range': 
			'SELECT p.id, p.name, p.start, p.end, p.color, c.id as cid, c.name AS chief FROM events AS p \
			LEFT JOIN chiefs AS c ON p.chief = c.id \
			WHERE p.start > :tStart AND p.start < :tEnd \
			ORDER BY p.start ASC',
		// select event by id
		'select event': 
			'SELECT p.id, p.name, p.chief AS cid, p.start, p.end, p.info, p.active, p.color, c.name AS chief \
			FROM events AS p \
			LEFT JOIN chiefs AS c on p.chief = c.id \
			WHERE p.id = :id',
		// select event chiefs
		'select chiefs': 
			'SELECT id, name FROM chiefs ORDER BY name',
		// update event
		'event exists update': 
			'SELECT id FROM events WHERE id != :id AND name = :name LIMIT 1',
		//
		'update event': 
			'UPDATE events set \
			name = :name, chief = :chief, start = :start, end = :end, info = :info, active = :active, color = :color \
			WHERE id = :id ;',
		// create event
		'event exists create': 
			'SELECT id FROM events WHERE name = :name LIMIT 1',
		//
		'create event': 
			'INSERT INTO events (name, chief, start, end, info, active, color) \
			VALUES (:name, :chief, :start, :end, :info, :active, :color)'
	};
	
	
})
