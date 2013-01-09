var app = app || {};

// A tasklist is a collection of tasks
( function() {'use strict';

		var TaskList = Backbone.Collection.extend({

			// Reference to this collection's model.
			model : app.Task,

			localStorage : new Store('todo-tasklist')
		});

		app.TaskList = new TaskList();
	}());
