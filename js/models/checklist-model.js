var app = app || {};
( function() {'use strict';
		app.CheckList = Backbone.Model.extend({
			defaults : {
				name : '',
				description: ''
			},
		});
	}()
);

