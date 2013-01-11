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
			try {
				this.$el.listview('refresh');
			} catch (e) {
				console.log("checklist refresh failed");
			}
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

	app.ChecklistSelectView = Backbone.View.extend({

		events : {
			'change' : 'selectChange'
		},

		initialize : function() {
			console.log('Created checklist select');
			app.checklistCol.on('change', this.render, this);
			app.checklistCol.on('add', this.addOne, this);
			app.checklistCol.on('reset', this.reset, this);
		},

		addChecklist : function() {
			$.mobile.changePage($('#checklistFormPage'));
		},

		selectChange : function() {
			console.log('checklist select changed: ' + this.$el.val());
			var selected = this.$el.val();
			var ni = selected.indexOf('newOption');
			if (ni != -1) {
				// Deselect newOption
				selected.splice(ni, 1);
				this.$el.val(selected);
				this.addChecklist();
			}
		},

		render : function() {
			console.log('Render ChecklistSelect');
			this.$el.select('refresh');
		},

		newOption : true,

		reset : function(checklist) {
			console.log('Reset checklistselect');
			this.$el.html('');
			if (this.newOption) {
				var newOption = $(this.make('option', {
					'value' : 'newOption'
				}, 'New...'));
				this.$el.append(newOption);
			}
			var addRender = function(checklist) {
				this.addOne(checklist).render();
			};
			// Render invdividual checklist
			app.checklistCol.each(addRender, this);
			// Render the collection
			this.render();
		},

		addOne : function(checklist) {
			var view = new app.ChecklistView({
				model : checklist
			});
			this.$el.append(view.$el);
			return view;
		},
	});
}())
