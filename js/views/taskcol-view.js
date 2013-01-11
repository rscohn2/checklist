var app = app || {};

/*
 * View the checklist collection as select/option list
 */
$( function() {'use strict';

	app.TaskColLView = Backbone.View.extend({
		el : '#tasklist',

		initialize : function() {
			app.taskCol.on('change', this.render, this);
			app.taskCol.on('add', this.add, this);
			app.taskCol.on('reset', this.reset, this);
		},
		
		render : function() {
			try {
				this.$el.listview('refresh');
			} catch (e) {
				console.log("tasklist refresh failed");
			}
		},

		reset : function() {
			this.$el.html('');
			var addRender = function(task) {
				this.add(task).render();
			};
			app.taskCol.each(addRender, this);
			this.render();
		},

		add : function(task) {
			console.log('add task: ' + task.get('name'));
			var view = new app.TaskLView({
				model : task
			});
			this.$el.append(view.$el);
			return view;
		},
	});
}())
