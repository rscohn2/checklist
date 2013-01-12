var app = app || {};

// References DOM, so delay until ready
$( function() {'use strict';

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
		},

		initialize : function() {
			// Create the views
			app.taskPage.view = new app.taskPage.View();
			app.taskFormPage.view = new app.taskFormPage.View();
			app.checklistPage.view = new app.checklistPage.View();
			app.checklistFormPage.view = new app.checklistFormPage.View();

			// Fetch the data
			app.taskCol.fetch();
			app.checklistCol.fetch();
		},
	});

	// Some methods that are common to all page views
	app.PageView = Backbone.View.extend({
		pageInit : false,
		onPageInit : function() {
			console.log('PageInit: ' + this.$el.prop('id'));
			this.pageInit = true;
		}	
	});
	
	app.taskPage = {};

	app.taskPage.View = app.PageView.extend({

		el : '#taskPage',

		// Delegated events for creating new items, and clearing completed ones.
		events : {
			'tap #newTaskButton' : 'newTask',
			'pageinit' : 'onPageInit'
		},

		initialize : function() {
			// Create the views
			app.taskPage.taskColLView = new app.TaskColLView();
			app.taskPage.checklistColSView = new app.ChecklistColSView({
				el : '#taskChecklistSelect'
			});

		},

		newTask : function() {
			app.taskFormPage.view.populateForm({
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

	app.taskFormPage.View = app.PageView.extend({

		el : '#taskFormPage',

		// Delegated events for creating new items, and clearing completed ones.
		events : {
			'tap #saveTaskButton' : 'saveTask',
			'tap #cancelTaskButton' : 'cancelTask',
			'change #taskDone' : 'doneChanged',
			'tap #deleteTaskButton' : 'deleteTask',
			'pageinit' : 'onPageInit'
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
				name : this.nameEl.val(),
				description : this.descriptionEl.val(),
				doneLat : this.doneLatEl.text(),
				doneLong : this.doneLongEl.text(),
				doneDate : this.doneDateEl.text(),
				done : this.doneEl.prop('checked')
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
			var done = this.doneEl.prop('checked');
			if (done) {
				this.doneDateEl.text(new Date());
				navigator.geolocation.getCurrentPosition(function(pos) {
					this.doneLatEl.text(pos.coords.latitude);
					this.doneLongEl.text(pos.coords.longitude);
				});
			} else {
				this.doneLatEl.text('');
				this.doneLongEl.text('');
				this.doneDateEl.text('');
			}
		},

		populateForm : function(task) {
			this.nameEl.val(task.name);
			this.descriptionEl.val(task.description);
			this.doneLatEl.text(task.doneLat);
			this.doneLongEl.text(task.doneLong);
			this.doneDateEl.text(task.doneDate);
			this.doneEl.prop('checked', task.done);
			app.refresh(this.doneEl, this.doneEl.checkboxradio);
		},

		// jquery handles for the elements that contain inputs
		nameEl : $('#taskName'),
		descriptionEl : $('#taskDescription'),
		doneEl : $('#taskDone'),
		doneLatEl : $('#taskDoneLat'),
		doneLongEl : $('#taskDoneLong'),
		doneDateEl : $('#taskDoneDate'),

	});

	app.checklistPage = {};
	app.checklistPage.View = app.PageView.extend({

		el : '#checklistPage',

		// Delegated events for creating new items, and clearing completed ones.
		events : {
			'tap #newChecklistButton' : 'newChecklist',
		},

		initialize : function() {
			// Create the views
			app.checklistColLView = new app.ChecklistColLView();
		},

		newChecklist : function() {
			app.checklistFormPage.view.populateForm({
				name : '',
				description : ''
			});
			app.editChecklist = null;
		},
	});

	app.checklistFormPage = {};
	app.checklistFormPage.View = app.PageView.extend({

		el : '#checklistFormPage',

		// Delegated events for creating new items, and clearing completed ones.
		events : {
			'tap #saveChecklistButton' : 'saveChecklist',
			'tap #cancelChecklistButton' : 'cancelChecklist',
			'tap #deleteChecklistButton' : 'deleteChecklist',
			'pageinit' : 'onPageInit'
		},

		initialize : function() {
		},

		deleteChecklist : function() {
			if (app.editChecklist) {
				app.editChecklist.destroy();
			}
			app.editChecklist = null;
		},

		saveChecklist : function() {
			var o = {
				name : this.nameEl.val(),
				description : this.descriptionEl.val()
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

		populateForm : function(checklist) {
			this.nameEl.val(checklist.name);
			this.descriptionEl.val(checklist.description);
		},

		nameEl : $('#checklistName'),
		descriptionEl : $('#checklistDescription')

	});

}())
