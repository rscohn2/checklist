var app = app || {};

// References DOM so delay execution
$(function() {'use strict';

	console.log('TaskView created');
	app.TaskView = Backbone.View.extend({

		tagName : 'li',

		// The DOM events specific to an item.
		events : {
			'tap a' : 'edit',
			/*
			 'click .toggle' : 'togglecompleted',
			 'dblclick label' : 'edit',
			 'click .destroy' : 'clear',
			 'keypress .edit' : 'updateOnEnter',
			 'blur .edit' : 'close'
			 */
		},

		initialize : function() {
			console.log('task view initialized');
			this.model.on('change', this.change, this);
			this.model.on('destroy', this.remove, this);
		},

		edit : function() {
			app.TaskForm.model = this.model;
			app.TaskForm.render();
		},

		safeSync : function() {
			console.log('Sync: ' + this.model.get('name'));
			var o = {
				success : function() {
				},
				error : function() {
					console.log('error syncing');
				}
			};

			var method = 'update';
			if (!this.model.created) {
				method = 'create';
				this.model.created = true;
			}
			console.log('   ' + method);
			Backbone.sync(method, this.model, o);
		},

		change : function() {
			console.log('change task: ' + this.model.get('name'));
			this.render();
			this.safeSync('create');
		},

		// Remember the <a> so we can update it when there is a change event
		$a : undefined,
		
		// Re-render the titles of the todo item.
		render : function() {
			console.log('render task' + this.model.get('name'));
			var task = this.model;
			if (!this.$a) {
				// New view, insert the html into DOM and remember a handle to it so we can
				// update it when it is changed
				this.$a = $(this.make('a', {'href': '#taskFormPage', 'data-transition': 'slide'}));
				this.$el.append(this.$a);
			}
			// Update the <a>
			this.$a.html(task.get('name'));
			return this;
		},
	});
});
