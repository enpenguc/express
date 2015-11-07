/**
 * 清单列表
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 16:24:55
 * @version $Id$
 */
define(['jquery',
	'underscore',
	'./historyView.js',
], function($, _, View, LocalStorage) {
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
		initialize: function(options) {
			var view = new View({
				collection: this.options.dbStorage
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