var app = app || {};
( function() {'use strict';
		app.Task = Backbone.Model.extend({
			defaults : {
				name : '',
				description: '',
				checklist : null,
				dueDate : null,
				doneDate : null,
				doneLat : null,
				doneLong : null,
				done : false
			},
		});
	}()
);
