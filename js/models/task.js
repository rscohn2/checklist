var app = app || {};
( function() {'use strict';
		app.Task = Backbone.Model.extend({
			defaults : {
				name : '',
				checkList : '',
				dueDate : '',
				done : false
			},
		});
	}()
);
