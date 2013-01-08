var app = app || {};

// References DOM, so delay until ready
$( function() {'use strict';
	var taskNameEl = $('#taskName');
	var taskDescriptionEl = $('#taskDescription');
	var taskDoneEl = $('#taskDone');

	app.TaskFormView = Backbone.View.extend({

		el : '#taskFormPage',

		// Delegated events for creating new items, and clearing completed ones.
		events : {
			'tap #saveTaskButton' : 'saveTask',
			'tap #cancelTaskButton' : 'cancelChangeTask',
			'tap #deleteTaskButton' : 'deleteTask'
		},

		initialize : function() {
			console.log('taskform view initialized');
		},

		cancelChangeTask : function() {
			console.log('Cancel change task');
		},

		deleteTask : function() {
			this.model.destroy();
		},
		
		saveTask : function() {
			console.log('Save task');
			var task = this.model;
			task.set(
				{
					name: taskNameEl.val(),
					description: taskDescriptionEl.val(),
					done: taskDoneEl.val() == 'yes'
				});
		},

		render : function() {
			console.log('Render task form');
			var task = this.model;
			taskNameEl.val(task.escape('name'));
			taskDescriptionEl.val(task.escape('description'));
			taskDoneEl.val(task.get('done') ? 'yes' : 'no').slider('refresh');
		},
	});
}())
