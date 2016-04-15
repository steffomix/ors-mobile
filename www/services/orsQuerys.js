angular.module('openRentstockApp')
.factory('orsQuerys', function($http){
	
	return {
		/*
		manage project
		*/
		// select projects
		'select projects': 
			'SELECT * FROM projects ORDER BY start DESC',
		//
		'select project by date range': 
			'SELECT p.id, p.name, p.start, p.end, p.color, c.id as cid, c.name AS chief FROM projects AS p \
			LEFT JOIN chiefs AS c ON p.chief = c.id \
			WHERE p.start > :tStart AND p.start < :tEnd \
			ORDER BY p.start ASC',
		// select project by id
		'select project': 
			'SELECT p.id, p.name, p.chief AS cid, p.start, p.end, p.info, p.active, p.color, c.name AS chief \
			FROM projects AS p \
			LEFT JOIN chiefs AS c on p.chief = c.id \
			WHERE p.id = :id',
		// select project chiefs
		'select chiefs': 
			'SELECT id, name FROM chiefs ORDER BY name',
		// update project
		'project exists update': 
			'SELECT id FROM projects WHERE id != :id AND name = :name LIMIT 1',
		//
		'update project': 
			'UPDATE projects set \
			name = :name, chief = :chief, start = :start, end = :end, info = :info, active = :active, color = :color \
			WHERE id = :id ;',
		// create project
		'project exists create': 
			'SELECT id FROM projects WHERE name = :name LIMIT 1',
		//
		'create project': 
			'INSERT INTO projects (name, chief, start, end, info, active, color) \
			VALUES (:name, :chief, :start, :end, :info, :active, :color)'
	};
	
	
});

/*
['id', projectId, 'int'],
				['name', p.name, 'string'],
				['chief', p.cid, 'int'],
				['start', getDate(f.dateStart.$modelValue, f.timeStart.$modelValue, 'db'), 'string'],
				['end', getDate(f.dateEnd.$modelValue, f.timeEnd.$modelValue, 'db'), 'string'],
				['info', p.info, 'string']
*/
