/**
 * 
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 15:16:43
 * @version $Id$
 */
define(['jquery',
	'./scanningView.js',
], function($, View) {
	"use strict"

	var controller = function(options) {
		this.options = _.extend({}, _.result(this, 'options'), options || {});
		this.initialize.apply(this, this.options.params);
	};
	controller.prototype = {
		options: {
			router: undefined,
			dbStorage: undefined,
			params: {},
			el: "#container"
		},
		initialize: function(id) {
			var dbStorage = this.options.dbStorage,
				model = id ? dbStorage.get(id) : dbStorage.getLast()

			var view = new View({
				model: model,
				router: this.options.router,
			});
			$(this.options.el).empty().append(view.render().el);
		},
		destroy: function() {
			if (this.view) {
				this.view.remove();
			}
		}
	}
	return controller;
});