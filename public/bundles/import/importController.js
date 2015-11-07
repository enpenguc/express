/**
 * 
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 12:42:24
 * @version $Id$
 */
define(['jquery',
	'./importView.js',
], function($, View, LocalStorage) {
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
		initialize: function() {
			var view = new View({
				dbStorage: this.options.dbStorage,
				router: this.options.router
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