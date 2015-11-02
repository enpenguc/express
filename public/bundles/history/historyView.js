/**
 * 清单列表
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 16:24:55
 * @version $Id$
 */
define(['jquery',
	'backbone',
	'handlebars',
	'text!./historyTpl.html'
], function($, Backbone, Handlebars, tpl) {
	"use strict"
	var View = Backbone.View.extend({
		template: Handlebars.compile(tpl),
		events: {
			"keypress [name='num']": "inputNum",
		},
		render: function(argument) {
			var data = this.collection.toJSON();
			var html = this.template({
				items: data
			});
			this.$el.html(html);
			return this;
		},
		inputNum: function(e) {


		}
	});

	return View;
});