/**
 * 清单列表
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 16:24:55
 * @version $Id$
 */
define(['jquery',
	'backbone',
	'handlebars',
	'text!./historyTpl.html',
	'handlebars-hepler'
], function($, Backbone, Handlebars, tpl) {
	"use strict"
	var View = Backbone.View.extend({
		template: Handlebars.compile(tpl),
		events: {
			"click [data-action='delete']": "removeRecord",
		},
		initialize: function() {
			this.listenTo(this.collection, "remove", this.render);
		},
		render: function(argument) {
			var data = this.collection.toJSON();
			var html = this.template({
				items: data
			});
			this.$el.html(html);
			return this;
		},
		removeRecord: function(e) {
			var id = $(e.target).data("id");
			if (confirm("确定删除此记录么？")) {
				var model = this.collection.get(id);
				if (model) {
					model.destroy();
				}
			}
		}
	});

	return View;
});