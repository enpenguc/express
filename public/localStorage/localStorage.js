/**
 * 
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 12:51:52
 * @version $Id$
 */
define(['jquery', 'backbone', 'backbone.localStorage'], function(View) {

	var Model = Backbone.Model.extend({
		// Default attributes for the todo item.  
		defaults: function() {
			return {
				id: undefined,
				takeout: false,
				scanned: false,
				scannedCount: 0
			};
		},
		scanned: function(argument) {
			var count = this.get("scannedCount");
			this.set({
				scanned: true,
				scannedCount: (count + 1)
			});
		}
	});

	var Collection = Backbone.Collection.extend({
		model: Model,
		localStorage: new Backbone.LocalStorage("order-db-backbone"),
	});

	return new Collection();
	// var db = new Collection();
	// return {
	// 	reset: function(data, options) {
	// 		db.reset(data, options)
	// 	},
	// 	scanned: function(id) {
	// 		var model = db.get(id);
	// 		if (model) {
	// 			model.scanned
	// 				return true;
	// 		} else {
	// 			return false;
	// 		}
	// 	}
	// };
});