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
	initialize: function(argument) {
		// body...
	},
	render: function(argument) {
		$("#upload").fileinput({
			uploadUrl: "/import",
			language: "zh",
			previewFileType: "text"
		});
		return this;
	},
	remove: function(argument) {
		// body...
	}
});


var app = new order();
Backbone.history.start();