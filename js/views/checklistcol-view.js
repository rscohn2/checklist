var app = app || {};

/*
 * View the checklist collection as select/option list
 */
$( function() {'use strict';

	app.ChecklistColLView = Backbone.View.extend({
		el : '#checklist',

		initialize : function() {
			app.checklistCol.on('change', this.render, this);
			app.checklistCol.on('add', this.add, this);
			app.checklistCol.on('reset', this.reset, this);
		},
		
		render : function() {
			app.refresh(this.$el, this.$el.listview);
		},

		reset : function() {
			this.$el.html('');
			var addRender = function(checklist) {
				this.add(checklist).render();
			};
			app.checklistCol.each(addRender, this);
			this.render();
		},

		add : function(checklist) {
			console.log('add checklist: ' + checklist.get('name'));
			var view = new app.ChecklistLView({
				model : checklist
			});
			this.$el.append(view.$el);
			return view;
		},
	});

	app.ChecklistColSView = Backbone.View.extend({

		events : {
		},

		initialize : function() {
			console.log('Created checklist select');
			app.checklistCol.on('change', this.render, this);
			app.checklistCol.on('add', this.add, this);
			app.checklistCol.on('reset', this.reset, this);
		},

		render : function() {
			console.log('Render ChecklistSelect');
			app.refresh(this.$el, this.$el.select);
		},

		reset : function(checklist) {
			console.log('Reset checklistselect');
			this.$el.html('');
			var addRender = function(checklist) {
				this.add(checklist).render();
			};
			// Render invdividual checklist
			app.checklistCol.each(addRender, this);
			// Render the collection
			this.render();
		},

		add : function(checklist) {
			var view = new app.ChecklistSView({
				model : checklist
			});
			this.$el.append(view.$el);
			return view;
		},
	});
}())
