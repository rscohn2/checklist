var app = app || {};

// References DOM, so delay until ready
$( function() {'use strict';

	var tasklist = $('#taskList');
	var checklistEl = $('#checklist');

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
			app.TaskList.on('change', this.renderTask, this);
			app.TaskList.on('add', this.addTask, this);
			app.TaskList.on('reset', this.resetTask, this);
			app.checklistCol.on('change', this.renderChecklist, this);
			app.checklistCol.on('add', this.addChecklist, this);
			app.checklistCol.on('reset', this.resetChecklist, this);

			// Create the views
			app.TaskForm = new app.TaskFormView();
			//app.tasklistChecklistSelect = new app.ChecklistSelectView({el: '#tasklistChecklistSelect'});
			//app.tasklistChecklistSelect.newOption = false;
			//app.taskFormChecklistSelect = new app.ChecklistSelectView({el: '#taskFormChecklistSelect'});

			// Fetch the data
			app.TaskList.fetch();
			app.checklistCol.fetch();
		},

		newChecklist : function() {
			app.checklistCol.create({
				name: $('#checklistName').val(),
				description: $('#checklistDescription').val()
			});				
		},
		
		newTask : function() {
			console.log('New Task');
			var task = new app.Task();
			app.TaskList.add(task);
			app.TaskForm.model = task;
			app.TaskForm.render();
		},

		renderTask : function() {
			console.log('Render app');
			console.log('refresh listview');
			tasklist.listview('refresh');
		},

		resetTask : function(tasks) {
			console.log('Reset');
			tasklist.html('');
			var addRender = function(task) {
				this.addTask(task).render();
			};
			app.TaskList.each(addRender, this);
			this.render();
		},

		addTask : function(task) {
			console.log('addOne: ' + task.get('name'));
			var view = new app.TaskView({
				model : task
			});
			tasklist.append(view.$el);
			return view;
		},

		renderChecklist : function() {
			checklistEl.listview('refresh');
		},

		resetChecklist : function() {
			checklistEl.html('');
			var addRender = function(checklist) {
				this.addChecklist(checklist).render();
			};
			app.checklistCol.each(addRender, this);
			this.renderChecklist();
		},

		addChecklist : function(checklist) {
			console.log('add checklist: ' + checklist.get('name'));
			var view = new app.ChecklistLView({
				model : checklist
			});
			checklistEl.append(view.$el);
			return view;
		},

	});
}())
