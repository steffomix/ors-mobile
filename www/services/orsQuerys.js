angular.module('openRentstockApp')
.factory('orsQuerys', function($http){
	
	return {
		/*
		manage project
		*/
		// select projects
		'select projects': 'select * from projects order by start desc',
		// select project by id
		'select project': 'select p.id, p.name, p.chief as cid, p.start, p.end, p.info, p.active, p.color, c.name as chief \
			from projects as p \
			left join chiefs as c on p.chief = c.id \
			where p.id = :id',
		// select project chiefs
		'select chiefs': 'select id, name from chiefs order by name',
		// update project
		'project exists update': 'select id from projects where id != :id and name = :name limit 1',
		'update project': 'update projects set \
			name = :name, chief = :chief, start = :start, end = :end, info = :info, active = :active, color = :color \
			where id = :id ;',
		// create project
		'project exists create': 'select id from projects where name = :name limit 1',
		'create project': 'insert into \
			projects (name, chief, start, end, info, active, color) \
			values (:name, :chief, :start, :end, :info, :active, :color)'
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
