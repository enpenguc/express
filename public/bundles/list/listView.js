/**
 * 清单列表
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 16:24:55
 * @version $Id$
 */
define(['jquery',
	'backbone',
	'handlebars',
	'text!./listTpl.html'
], function($, Backbone, Handlebars, tpl) {
	"use strict"
	var View = Backbone.View.extend({
		template: Handlebars.compile(tpl),
		options: {
			data: {
				id: ""
			}
		},
		initialize: function(options) {
			this.options = _.extend({}, _.result(this, 'options'), options || {});
		},
		render: function() {
			var data = this.collection ? this.collection.toJSON() : [];
			var html = this.template({
				items: data,
				data: this.options.data
			});
			this.$el.html(html);
			return this;
		}
	});

	return View;
});