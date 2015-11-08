/**
 * 清单列表
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 16:24:55
 * @version $Id$
 */
define(['jquery',
	'underscore',
	'backbone',
	'handlebars',
	'text!./listTpl.html',
	'text!./tableTpl.html',
	'handlebars-hepler'
], function($, _, Backbone, Handlebars, tpl, tableTpl) {
	"use strict"

	var View = Backbone.View.extend({
		template: Handlebars.compile(tpl),
		templateTable: Handlebars.compile(tableTpl),
		events: {
			"click #btnExport": "export",
			"change #selFilter": "filter"
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
				var form = this.$el.find("form")
				form.children("[name='data']").val(d);
				form.submit();
			}
		},
		filter: function(e) {
			var v = $(e.target).val(),
				attrs;
			switch (v) {
				case "all":
					break;
				case "takeout":
					attrs = {
						takeout: true
					};
					break;
				case "noDeclare":
					attrs = {
						noDeclare: true
					};
					break;
				case "scanned":
					attrs = {
						scanned: true
					};
					break;
				case "noScanned":
					attrs = {
						scanned: false
					};
					break;
				case "repetition":
					attrs = function(item) {
						return item.scannedCount > 1
					}
					break;
			}
			var collection = this.model.getRecordCollection(),
				list = collection.toJSON(),
				data = {};
			if (typeof attrs === "function") {
				data = _.filter(list, attrs);
			} else if (attrs) {
				data = _.where(list, attrs);
			} else {
				data = list;
			}
			var html = this.templateTable(data);
			this.$el.find(".bs-table-wrap").empty().append(html);
		}
	});

	return View;
});