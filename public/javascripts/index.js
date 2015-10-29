var order = Backbone.Router.extend({
	routes: {
		"history": "history", // #help
		"help": "help",
		// "search/:query": "search", // #search/kiwis
		// "search/:query/p:page": "search", // #search/kiwis/p7
		"scan": "scanning",
		'import': 'index',
		'*path': 'index',
	},
	options: {},
	initialize: function(options) {
		this.options = _.extend({}, _.result(this, 'options'), options || {});
	},
	index: function() {
		this.currView = new index();
		this.currView.render();
		console.log("index");
	},
	scanning: function() {

	},
	history: function(argument) {
		console.log("history");
	},
	help: function(argument) {
		console.log("help");
		// body...
	},
	search: function(argument) {
		// body...
	}
});

var index = Backbone.View.extend({
	events: {
		// "fileuploaded #upload": "fileUploaed",
		// "fileuploaderror #upload": "fileuploaderror"
	},
	initialize: function(argument) {
		// body...
	},
	render: function(argument) {
		$("#upload").fileinput({
			uploadUrl: "/upload",
			language: "zh",
			// allowedFileExtensions=["csv"],
			previewFileType: "text",
			maxFileCount: 1
		}).on('fileuploaded', function(event, data, previewId, index) {
			var form = data.form,
				files = data.files,
				extra = data.extra,
				response = data.response,
				reader = data.reader;
			console.log('File uploaded triggered');
		}).on('filebatchuploadsuccess', function(event, data) {
			var form = data.form,
				files = data.files,
				extra = data.extra,
				response = data.response,
				reader = data.reader;
			console.log('File batch upload success');
		});
		return this;
	},
	fileUploaed: function(event, data, previewId, index) {
		debugger;
		var form = data.form,
			files = data.files,
			extra = data.extra,
			response = data.response,
			reader = data.reader;
		console.log('File uploaded triggered');
	},
	fileuploaderror: function(event, data) {
		var form = data.form,
			files = data.files,
			extra = data.extra,
			response = data.response,
			reader = data.reader;
		console.log('File upload error');
	},
	remove: function(argument) {
		$('#upload').fileinput('destroy');

		// $('#input-id').fileinput('upload');
		// body...
	}
});


var app = new order();
Backbone.history.start();