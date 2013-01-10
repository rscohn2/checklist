var app = app || {};

// References DOM so delay execution
$(function() {'use strict';

	app.ChecklistView = Backbone.View.extend({

		tagName : 'option',

		initialize : function() {
			console.log('checlist view initialized');
			this.model.on('change', this.change, this);
			this.model.on('destroy', this.remove, this);
		},

		remove : function() {
			return this;
		},
		
		change : function() {
			console.log('change checklist: ' + this.model.get('name'));
			this.render();
		},

		render : function() {
			console.log('render checklist' + this.model.get('name'));
			this.$el.attribute('value',cid);
			this.$el.text(this.model.escape('name'));
			return this;
		},
	});
});
