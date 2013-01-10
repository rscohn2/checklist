var app = app || {};

// References DOM, so delay until ready
$( function() {'use strict';

	var tasklist = $('#taskList');

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	app.AppView = Backbone.View.extend({

		el : '#app',

		// Delegated events for creating new items, and clearing completed ones.
		events : {
			'tap #newTaskButton' : 'newTask',
			'tap #saveChecklistButton' : 'newChecklist'
		},

		initialize : function() {
			app.TaskList.on('change', this.render, this);
			app.TaskList.on('add', this.addOne, this);
			app.TaskList.on('reset', this.reset, this);

			// Create the views
			app.TaskForm = new app.TaskFormView();
			app.tasklistChecklistSelect = new app.ChecklistSelectView({el: '#tasklistChecklistSelect'});
			app.tasklistChecklistSelect.newOption = false;
			app.taskFormChecklistSelect = new app.ChecklistSelectView({el: '#taskFormChecklistSelect'});

			// Fetch the data
			app.TaskList.fetch();
			app.checklistCol.fetch();
		},

		newChecklist : function() {
			var checklist = new app.Checklist();
				
		},
		
		newTask : function() {
			console.log('New Task');
			var task = new app.Task();
			app.TaskList.add(task);
			app.TaskForm.model = task;
			app.TaskForm.render();
		},

		render : function() {
			console.log('Render app');
			console.log('refresh listview');
			tasklist.listview('refresh');
		},

		reset : function(tasks) {
			console.log('Reset');
			tasklist.html('');
			var addRender = function(task) {
				this.addOne(task).render();
			};
			app.TaskList.each(addRender, this);
			this.render();
		},

		addOne : function(task) {
			console.log('addOne: ' + task.get('name'));
			var view = new app.TaskView({
				model : task
			});
			tasklist.append(view.$el);
			return view;
		},
	});
}())
