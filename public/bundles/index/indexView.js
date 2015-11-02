/**
 * 
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 12:51:52
 * @version $Id$
 */
define(['jquery',
	'underscore',
	'backbone',
	'handlebars',
	'text!./indexTpl.html',
	'bootstrap-fileinput',
	'bootstrap-fileinput-locale'
], function($, _, Backbone, Handlebars, tpl) {
	"use strict"

	var indexView = Backbone.View.extend({
		template: Handlebars.compile(tpl),
		options: {
			dbSorage: undefined
		},
		initialize: function(options) {
			this.options = _.extend({}, _.result(this, 'options'), options || {});
		},
		render: function() {
			var complated = !!this.model,
				data = {};
			if (complated) {
				data = {
					complated: true,
					count: this.model.getRecordCollection().length,
					takeout: this.model.getRecordCollection().getTackoutCount()
				}
			}
			var html = this.template(data);
			this.$el.html(html);
			if (!complated) {
				this.renderUploader();
			}
			return this;
		},
		renderUploader: function() {
			// listen
			var self = this;
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
				self.loadDataError("error");
			});
		},
		loadDataError: function(error) {
			alert(error);
		},
		loadDataSuccess: function(data) {
			var self = this;
			this.model = this.options.dbSorage.addRecord(data);
			window.setTimeout(function() {
				self.$('#upload').fileinput('destroy');
				self.render();
				// window.location.reload();
			}, 600);
		},
		remove: function(argument) {
			this.$('#upload').fileinput('destroy');
			Backbone.View.prototype.remove.apply(this);
		}
	});

	return indexView;
});