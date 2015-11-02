/**
 * 清单列表
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 16:24:55
 * @version $Id$
 */
define(['jquery',
	'./listView.js',
	'/localStorage/localStorage.js'
], function($, View, LocalStorage) {
	"use strict"
	var controller = function(id) {
		var currModel = id ? LocalStorage.db.get(id) : LocalStorage.db.getLast();
		var currCollection = currModel ? currModel.getCollection() : null;
		var view = new View({
			collection: currCollection,
			data: {
				id: id
			}
		});
		$("#container").empty().append(view.render().el);
		// onRouteChange销毁
		controller.onRouteChange = function() {
			console.log('change');
			//可以做一些销毁工作，例如view.undelegateEvents()
			view.remove();
			view = null;
		};
	};
	return controller;
});