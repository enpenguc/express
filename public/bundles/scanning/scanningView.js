/**
 * 
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 15:16:34
 * @version $Id$
 */
define(['jquery',
	'backbone',
	'handlebars',
	'/LocalStorage/LocalStorage.js',
	'text!./scanningTpl.html'
], function($, Backbone, Handlebars, LocalStorage, tpl) {
	"use strict"
	var View = Backbone.View.extend({
		template: Handlebars.compile(tpl),
		events: {
			"keypress [name='num']": "inputNum",
		},
		initialize: function(argument) {
			// body...
		},
		render: function(argument) {
			var html = this.template({});
			this.$el.html(html);
			return this;
		},
		inputNum: function(e) {
			if (e.keyCode !== 13) {
				return;
			}
			var $el = $(e.target),
				v = $.trim($el.val());
			if (!v) {
				return;
			}
			// 获取数据model
			var model = LocalStorage.get(v);
			if (model) {
				model.scanned();
				$el.val("").focus().parent().removeClass("has-error");
				this.$el.find(".alert").hide();
			} else {
				this.$el.find("#nodifyAudio")[0].play();
				this.$el.find(".alert").show();
				$el.parent().addClass("has-error");
			}
		}
	});

	return View;
});