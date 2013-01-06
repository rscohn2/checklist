var app = app || {};

// References DOM so delay execution
$(function() {'use strict';

	console.log('TaskView created');
	app.TaskView = Backbone.View.extend({

		tagName : 'li',

		// Cache the template function for a single item.
		template : _.template($('#task-template').html()),

		// The DOM events specific to an item.
		events : {
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
			this.model.on('change', this.render, this);
			this.model.on('destroy', this.remove, this);
		},

		// Re-render the titles of the todo item.
		render : function() {
			console.log('render task' + this.model.get('name'));
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

	});
});
