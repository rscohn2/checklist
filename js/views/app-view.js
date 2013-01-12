var app = app || {};

// References DOM, so delay until ready
$( function() {'use strict';

	// jquery handles for the elements that contain inputs
	var taskNameEl = $('#taskName');
	var taskDescriptionEl = $('#taskDescription');
	var taskDoneEl = $('#taskDone');
	var taskDoneLatEl = $('#taskDoneLat');
	var taskDoneLongEl = $('#taskDoneLong');
	var taskDoneDateEl = $('#taskDoneDate');

	var checklistNameEl = $('#checklistName');
	var checklistDescriptionEl = $('#checklistDescription');

	app.populateTaskForm = function(task) {
		taskNameEl.val(task.name);
		taskDescriptionEl.val(task.description);
		taskDoneLatEl.text(task.doneLat);
		taskDoneLongEl.text(task.doneLong);
		taskDoneDateEl.text(task.doneDate);
		taskDoneEl.prop('checked', task.done);
		app.refresh(taskDoneEl, taskDoneEl.checkboxradio);
	};

	app.populateChecklistForm = function(checklist) {
		checklistNameEl.val(checklist.name);
		checklistDescriptionEl.val(checklist.description);
	};

	app.refresh = function(object, constructor) {
		try {
			constructor.call(object, 'refresh');
		} catch(e) {
			console.log('Refresh failed: ' + object.prop('name'));
			console.log('  message: ' + e.message);
		}
	};

	app.logEvent = function(event, o) {
		console.log(event + ': ' + o.$el.prop('id'));
	};

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	app.AppView = Backbone.View.extend({

		el : '#app',

		// Delegated events for creating new items, and clearing completed ones.
		events : {
			'tap #newChecklistButton' : 'newChecklist',
			'tap #saveChecklistButton' : 'saveChecklist',
			'tap #cancelChecklistButton' : 'cancelChecklist',
			'tap #deleteChecklistButton' : 'deleteChecklist'
		},

		initialize : function() {
			// Create the views
			app.checklistColLView = new app.ChecklistColLView();
			app.taskPage.view = new app.taskPage.View();
			app.taskFormPage.view = new app.taskFormPage.View();

			// Fetch the data
			app.taskCol.fetch();
			app.checklistCol.fetch();
		},

		deleteChecklist : function() {
			if (app.editChecklist) {
				app.editChecklist.destroy();
			}
			app.editChecklist = null;
		},

		newChecklist : function() {
			app.populateChecklistForm({
				name : '',
				description : ''
			});
			app.editChecklist = null;
		},

		saveChecklist : function() {
			var o = {
				name : checklistNameEl.val(),
				description : checklistDescriptionEl.val()
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

	});

	app.taskPage = {};

	app.taskPage.View = Backbone.View.extend({

		el : '#taskPage',

		// Delegated events for creating new items, and clearing completed ones.
		events : {
			'tap #newTaskButton' : 'newTask',
		},

		initialize : function() {
			// Create the views
			app.taskPage.taskColLView = new app.TaskColLView();
			app.taskPage.checklistColSView = new app.ChecklistColSView({
				el : '#taskChecklistSelect'
			});

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
	});

	app.taskFormPage = {};
	
	app.taskFormPage.View = Backbone.View.extend({

		el : '#taskFormPage',

		// Delegated events for creating new items, and clearing completed ones.
		events : {
			'tap #saveTaskButton' : 'saveTask',
			'tap #cancelTaskButton' : 'cancelTask',
			'change #taskDone' : 'doneChanged',
			'tap #deleteTaskButton' : 'deleteTask',
		},

		initialize : function() {
			// Create the views
			app.taskFormChecklistColSView = new app.ChecklistColSView({
				el : '#taskFormChecklistSelect'
			});
		},

		deleteTask : function() {
			console.log('delete task');
			if (app.editTask) {
				app.editTask.destroy();
			}
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
