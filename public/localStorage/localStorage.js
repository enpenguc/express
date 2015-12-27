/**
 * 
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 12:51:52
 * @version $Id$
 */
define(['jquery',
	'underscore',
	'backbone',
	'/localstorage/model.js',
	'backbone.localStorage'
], function($, _, Backbone, Model) {

	var dbStorage = Backbone.Collection.extend({
		model: Model.Express,
		comparator: "ctime",
		localStorage: new Backbone.LocalStorage("backbone-express-db"),
		initialize: function() {
			this.listenTo(this, "change", this.saveData);
		},
		saveData: function() {
			console.log(arguments);
			// this.save();
		},
		getLast: function() {
			var model = this.last();
			return model && model.get("complated") ? null : model;
		},
		addRecord: function(data) {
			var model = new Model.Express({
				name: data.name,
				record: data.items
			});
			this.create(model);
			return model;
		},
		getLastCollection: function() {
			var model = this.getLast(),
				collection;
			if (model) {
				collection = model.get("recordCollection");
			}
			return collection;
		},
		getLastCollectionData: function() {
			var model = this.getLast(),
				data = [];
			if (model) {
				data = model.get("recordCollection").toJSON();
			}
			return data;
		}
	});

	return dbStorage;
});