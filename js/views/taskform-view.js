var app = app || {};

// References DOM, so delay until ready
$( function() {'use strict';
	// jquery handles for the elements that contain inputs
	var taskNameEl = $('#taskName');
	var taskDescriptionEl = $('#taskDescription');
	var taskDoneEl = $('#taskDone');
	var taskDoneLocEl = $('#taskDoneLoc');
	var taskDoneDateEl = $('#taskDoneDate');
	
	/*
	 * While we are editing, values live in the forms.
	 * Some values lose info when being rendered so store
	 * them in helper variables.
	 */
	var done;
	var doneLat;
	var doneLong;
	var doneDate;	
	
	var formatLoc = function() {
		return doneLat ? 'latitude: ' + doneLat + ' longitude: ' + doneLong : '';
	};
	
	var formatDate = function() {
		return doneDate || '';
	};
	
	app.TaskFormView = Backbone.View.extend({

		el : '#taskFormPage',

		// Delegated events for creating new items, and clearing completed ones.
		events : {
			'tap #saveTaskButton' : 'saveTask',
			'tap #cancelTaskButton' : 'cancelChangeTask',
			'tap #deleteTaskButton' : 'deleteTask',
			'change #taskDone' : 'doneChanged'
		},

		initialize : function() {
			console.log('taskform view initialized');
		},

		doneChanged : function() {
			console.log('Done changed');
			var done = taskDoneEl.prop('checked');
			var task = this.model;
			if (done) {
				doneDate = new Date();
				console.log('done date: ' + doneDate);
				navigator.geolocation.getCurrentPosition(function (pos) {
					doneLat = pos.coords.latitude;
					doneLong = pos.coords.longitude;
					console.log('done loc: ' + formatLoc());
					taskDoneLocEl.text(formatLoc());
				});
			} else {
				doneLat = doneLong = doneDate = null;
				taskDoneLocEl.text(formatLoc());

			}
			taskDoneDateEl.text(formatDate());
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
					done: taskDoneEl.prop('checked'),
					doneDate: doneDate,
					doneLat: doneLat,
					doneLong: doneLong
				});
		},

		render : function() {
			console.log('Render task form');
			var task = this.model;
			taskNameEl.val(task.escape('name'));
			taskDescriptionEl.val(task.escape('description'));
			done = task.get('done');
			taskDoneEl.prop('checked', done);
			taskDoneEl.checkboxradio('refresh');
			doneDate = task.escape('doneDate');
			doneLat = task.escape('doneLat');
			doneLong = task.escape('doneLong');
			taskDoneDateEl.text(formatDate());
			taskDoneLocEl.text(formatLoc());
		},
	});
}())
