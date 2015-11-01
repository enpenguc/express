var orderRouter = Backbone.Router.extend({
		routes: {
			"history": "history", // #help
			"help": "help",
			// "search/:query": "search", // #search/kiwis
			// "search/:query/p:page": "search", // #search/kiwis/p7
			"scan": "scanning",
			'import': 'index',
			// '*path': 'index',
			'*actions': 'index'
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




// var app = new orderApp();
// Backbone.history.start();