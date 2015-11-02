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
		events: {
			"click #btnExport": "export"
		},
		render: function() {
			var data = {};
			if (this.model) {
				data = this.model.toJSON();
			}
			var html = this.template(data);
			this.$el.html(html);
			return this;
		},
		export: function() {
			if (this.model) {
				var d = this.model.getExportCsv();
				// $.post("/export", {
				// 	d: d
				// });
			}
		}
	});

	return View;
});