var app = app || {};

/*
 * View the checklist collection as select/option list
 */
$( function() {'use strict';

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
				selected.splice(ni,1);
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
