angular.module('projectsViewModule').
	factory('projectDataProvider', ['$http', function($http){

		var baseUrl = 'projects.json', 
		projects = [], 
		ipp = 25; // items per page

		function getInt(i){
			return (isNaN(i) ? 1 : Math.abs(parseInt(i)));
		};

		var instance = {
			
			projects: projects,

			page: function (page){
				page = getInt(page); // todo

				$http.get(baseUrl).then(
				function(data){
					console.log(data);
					data.data.forEach(function(p){
						projects.push(p);
					});

				},
				function(e){
					//console.error(e);
				}
				);
			},

			getProject: function (id){
				var project = false;
				for(var i = 0; i < projects.length; i++){
					if(projects[i].id == id){
						project = projects[i];
						break;
					}
				}
				return project;
			},
			
			updateProject: function(project){
				
			},
			createProject: function(project){
				
			},
			disableProject: function(id){
				
			},
			enableProject: function(id){
				
			},
			// 
			registerListener: function(obj, fc){
				listeners.push([obj, fc]);
			},

		};

		instance.page(1);
		
		return instance;

	}]);

