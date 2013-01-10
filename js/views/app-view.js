var app = app || {};

// References DOM, so delay until ready
$( function() {'use strict';

	// jquery handles for the elements that contain inputs
	var tasklistEl = $('#taskList');
	var checklistEl = $('#checklist');

	var taskNameEl = $('#taskName');
	var taskDescriptionEl = $('#taskDescription');
	var taskDoneEl = $('#taskDone');
	var taskDoneLatEl = $('#taskDoneLat');
	var taskDoneLongEl = $('#taskDoneLong');
	var taskDoneDateEl = $('#taskDoneDate');

	app.populateTaskForm = function(task) {
		taskNameEl.val(task.name);
		taskDescriptionEl.val(task.description);
		taskDoneLatEl.text(task.doneLat);
		taskDoneLongEl.text(task.doneLong);
		taskDoneDateEl.text(task.doneDate);
		taskDoneEl.prop('checked', task.done);
		try {
			taskDoneEl.checkboxradio('refresh');
		} catch(e) {
			console.log('refresh of task done failed');
		}

	};

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	app.AppView = Backbone.View.extend({

		el : '#app',

		// Delegated events for creating new items, and clearing completed ones.
		events : {
			'tap #newTaskButton' : 'newTask',
			'tap #saveTaskButton' : 'saveTask',
			'tap #cancelTaskButton' : 'cancelTask',
			'change #taskDone' : 'doneChanged',

			'tap #newChecklistButton' : 'newChecklist',
			'tap #saveChecklistButton' : 'saveChecklist',
			'tap #cancelChecklistButton' : 'cancelChecklist'

		},

		initialize : function() {
			app.taskCol.on('change', this.renderTask, this);
			app.taskCol.on('add', this.addTask, this);
			app.taskCol.on('reset', this.resetTask, this);
			app.checklistCol.on('change', this.renderChecklist, this);
			app.checklistCol.on('add', this.addChecklist, this);
			app.checklistCol.on('reset', this.resetChecklist, this);

			// Create the views
			//app.TaskForm = new app.TaskFormView();
			//app.taskColChecklistSelect = new app.ChecklistSelectView({el: '#taskColChecklistSelect'});
			//app.tasklistChecklistSelect.newOption = false;
			//app.taskFormChecklistSelect = new app.ChecklistSelectView({el: '#taskFormChecklistSelect'});

			// Fetch the data
			app.taskCol.fetch();
			app.checklistCol.fetch();
		},

		newChecklist : function() {
			$('#checklistName').val('');
			$('#checklistDescription').val('');
			app.editChecklist = null;
		},

		saveChecklist : function() {
			var o = {
				name : $('#checklistName').val(),
				description : $('#checklistDescription').val()
			};

			if (app.editChecklist) {
				app.editChecklist.set(o);
				app.editChecklist = null;
			} else {
				app.checklistCol.create(o);
			}
		},

		cancelChecklist : function() {
			app.editChecklist = null;
		},

		renderChecklist : function() {
			try {
				checklistEl.listview('refresh');
			} catch (e) {
				console.log("checklist refresh failed");
			}
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

		newTask : function() {
			app.populateTaskForm({
				name : '',
				description : '',
				doneLat : '',
				doneLong : '',
				doneDate : '',
				done : false
			})
			app.editTask = null;
		},

		saveTask : function() {
			var o = {
				name : taskNameEl.val(),
				description : taskDescriptionEl.val(),
				doneLat : taskDoneLatEl.text(),
				doneLong : taskDoneLongEl.text(),
				doneDate : taskDoneDateEl.text(),
				done : taskDoneEl.prop('checked')
			};

			if (app.editTask) {
				app.editTask.set(o);
				app.editTask = null;
			} else {
				app.taskCol.create(o);
			}
		},

		cancelTask : function() {
			app.editTask = null;
		},

		renderTask : function() {
			try {
				tasklistEl.listview('refresh');
			} catch (e) {
				console.log("tasklist refresh failed");
			}
		},

		resetTask : function() {
			tasklistEl.html('');
			var addRender = function(task) {
				this.addTask(task).render();
			};
			app.taskCol.each(addRender, this);
			this.renderTask();
		},

		addTask : function(task) {
			console.log('add task: ' + task.get('name'));
			var view = new app.TaskLView({
				model : task
			});
			tasklistEl.append(view.$el);
			return view;
		},

		doneChanged : function() {
			console.log('Done changed');
			var done = taskDoneEl.prop('checked');
			if (done) {
				taskDoneDateEl.text(new Date());
				navigator.geolocation.getCurrentPosition(function(pos) {
					taskDoneLatEl.text(pos.coords.latitude);
					taskDoneLongEl.text(pos.coords.longitude);
				});
			} else {
				taskDoneLatEl.text('');
				taskDoneLongEl.text('');
				taskDoneDateEl.text('');
			}
		},
	});
}())
