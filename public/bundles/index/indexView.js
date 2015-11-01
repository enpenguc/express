/**
 * 
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 12:51:52
 * @version $Id$
 */
define(['jquery', 'backbone', 'handlebars', '/LocalStorage/LocalStorage.js', 'text!./indexTpl.html', 'bootstrap-fileinput'],
	function($, Backbone, Handlebars, LocalStorage, tpl) {
		"use strict"

		var indexView = Backbone.View.extend({
			template: Handlebars.compile(tpl),
			events: {
				// "fileuploaded #upload": "fileUploaed",
				// "fileuploaderror #upload": "fileuploaderror"
			},
			initialize: function(argument) {
				// body...
			},
			render: function(argument) {
				var html = this.template({});
				this.$el.html(html);
				var self = this;
				// listen
				this.$el.find("#upload").fileinput({
					uploadUrl: "/upload",
					language: "zh",
					allowedFileExtensions: ["csv"],
					previewFileType: "text",
					maxFileCount: 1
				}).on('fileloaded', function(event, file, previewId, index, reader) {
					console.log("fileloaded")
					$(this).fileinput('upload');
				}).on('fileuploaded', function(event, data, previewId, index) {
					var form = data.form,
						files = data.files,
						extra = data.extra,
						response = data.response,
						reader = data.reader;
					console.log('File uploaded triggered');

					if (response.success) {
						self.loadDataSuccess(response.data);
					} else {
						self.loadDataError(response.error);
					}
				}).on('fileuploaderror', function(event, data, previewId, index) {
					var form = data.form,
						files = data.files,
						extra = data.extra,
						response = data.response,
						reader = data.reader;
					console.log('File upload error');
				});
				return this;
			},
			loadDataError: function(argument) {
				// body...
			},
			loadDataSuccess: function(data) {
				LocalStorage.reset(data.items);
				window.location = window.location + "#scan";
			},
			remove: function(argument) {
				this.$('#upload').fileinput('destroy');
				Backbone.View.prototype.remove.apply(this);
			}
		});

		return indexView;
	});