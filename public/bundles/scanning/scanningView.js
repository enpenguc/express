/**
 * 
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 15:16:34
 * @version $Id$
 */
define(['jquery',
	'backbone',
	'handlebars',
	'text!./scanningTpl.html',
	'handlebars-hepler'
], function($, Backbone, Handlebars, tpl) {
	"use strict"

	Handlebars.registerHelper('getLogTextClass', function(status) {
		status = $.trim(status).toLowerCase();
		var textClass = "text-muted";
		switch (status) {
			case "success":
				textClass = "text-success";
				break;
			case "info":
				textClass = "text-info";
				break;
			case "warning":
				textClass = "text-warning";
				break;
			case "error":
				textClass = "text-danger";
				break;
		}
		return textClass;
	});

	Handlebars.registerHelper('getLogIconClass', function(status) {
		status = $.trim(status).toLowerCase();
		var iconClass = "glyphicon-info-sign";
		switch (status) {
			case "success":
				iconClass = "glyphicon-ok-sign";
				break;
			case "Info":
				iconClass = "glyphicon-info-sign";
				break;
			case "warning":
				iconClass = "glyphicon-minus-sign";
				break;
			case "error":
				iconClass = "glyphicon-remove-sign";
				break;
		}
		return iconClass;
	});

	var View = Backbone.View.extend({
		template: Handlebars.compile(tpl),
		templateTip: Handlebars.compile(['<div class="alert {{alert}}" role="alert">',
			'<span class="glyphicon {{icon}}"></span>',
			'<span class="sr-only">{{status}}:</span> ',
			'<span>{{msg}}</span>',
			'</div>'
		].join("")),
		templateLog: Handlebars.compile(['{{#each this}}<p class="{{getLogTextClass status}} ">',
			'<span class="glyphicon {{getLogIconClass status}}"></span>',
			'<span class="sr-only">{{status}}:</span> ',
			'<span>{{moment ctime "YYYY-MM-DD HH:mm:ss.SSSS"}} - {{msg}}</span>',
			'</p>{{/each}}'
		].join("")),
		events: {
			"keypress [name='num']": "inputNum",
			"click #btnComplated": "complated"
		},
		options: {
			router: undefined
		},
		initialize: function(options) {
			this.options = _.extend({}, _.result(this, 'options'), options || {});
			this.listenTo(this.model.get("logCollection"), "add", this.showlog);
		},
		render: function() {
			var data = {};
			if (this.model) {
				data = this.model.toJSON();
			}
			var html = this.template(data);
			this.$el.html(html);
			//log
			if (data.logs) {
				var h = this.templateLog(data.logs);
				this.$el.find("#result").append(h);
			}
			this.audioSuccess = this.$el.find("#nodifyAudioSuccess")[0];
			this.audioError = this.$el.find("#nodifyAudioError")[0];
			return this;
		},
		showlog: function(model, collection, options) {
			var data = [model.toJSON()],
				h = this.templateLog(data);
			this.$el.find("#result").prepend(h);
		},
		// 扫描输入
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
			if (!this.model) {
				alert("尚未导入数据");
				return;
			}
			if (!this.model.get("record")) {
				return;
			}
			var result = this.model.scanning(v);
			if (result.get("status") === "Success") {
				this.audioSuccess.play();
			} else {
				this.audioError.play();
			}
			$el.val("").focus();

			// var model = this.model.getRecordCollection().get(v),
			// 	tip;
			// if (model) {
			// 	var scannedCount = model.get("scannedCount"),
			// 		takeout = model.get("takeout");
			// 	if (takeout) {
			// 		tip = {
			// 			id: v,
			// 			alert: "alert-danger",
			// 			msg: "需要取出包裹：" + v,
			// 			status: "INFO",
			// 			icon: "glyphicon-info-sign"
			// 		}
			// 		this.$el.find("#nodifyAudio")[0].play();
			// 	} else if (scannedCount > 0) {
			// 		// 重复
			// 		tip = {
			// 			id: v,
			// 			alert: "alert-warning",
			// 			msg: "重复包裹：" + v + ", 重复" + scannedCount + "次",
			// 			status: "Warning",
			// 			icon: "glyphicon-info-sign"
			// 		}
			// 		this.$el.find("#nodifyAudio")[0].play();
			// 	} else {
			// 		tip = {
			// 			id: v,
			// 			alert: "alert-success",
			// 			msg: "成功扫描：" + v,
			// 			status: "Success",
			// 			icon: "glyphicon-ok-sign"
			// 		}
			// 	}
			// 	model.setScanned();
			// } else {
			// 	tip = {
			// 		id: v,
			// 		alert: "alert-danger",
			// 		msg: "未申报到货：" + v,
			// 		status: "Error",
			// 		icon: "glyphicon-exclamation-sign"
			// 	}
			// 	this.model.getRecordCollection().addOneByScanned(v);
			// 	this.$el.find("#nodifyAudio")[0].play();
			// }
			// $el.val("").focus();
			// var html = this.templateTip(tip);
			// this.$el.find("#result").empty().append(html);
		},
		complated: function() {
			if (confirm("确定要标记为完成扫描,导出数据？")) {
				this.model.complated();
				this.options.router.navigate("#list/" + this.model.id, {
					trigger: true
				});
			}
		}
	});

	return View;
});