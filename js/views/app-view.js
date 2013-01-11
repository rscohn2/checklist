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
			'tap #deleteTaskButton' : 'deleteTask',

			'tap #newChecklistButton' : 'newChecklist',
			'tap #saveChecklistButton' : 'saveChecklist',
			'tap #cancelChecklistButton' : 'cancelChecklist',
			'tap #deleteChecklistButton' : 'deleteChecklist'

		},

		initialize : function() {
			// Create the views
			app.checklistColLView = new app.ChecklistColLView();
			app.taskColLView = new app.TaskColLView();
			
			// Create the views
			//app.TaskForm = new app.TaskFormView();
			//app.taskColChecklistSelect = new app.ChecklistSelectView({el: '#taskColChecklistSelect'});
			//app.tasklistChecklistSelect.newOption = false;
			//app.taskFormChecklistSelect = new app.ChecklistSelectView({el: '#taskFormChecklistSelect'});

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

		deleteTask : function() {
			console.log('delete task');
			if (app.editTask) {
				app.editTask.destroy();
			}
			app.editTask = null;
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
