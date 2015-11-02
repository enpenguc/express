/**
 * 
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 15:16:43
 * @version $Id$
 */
define(['jquery',
	'./scanningView.js',
	'/localStorage/localStorage.js'
], function($, View, LocalStorage) {
	"use strict"
	var controller = function(id) {
		var currModel = id ? LocalStorage.db.get(id) : LocalStorage.db.getLast();
		var view = new View({
			model: currModel
		});
		$("#container").empty().append(view.render().el);
		// onRouteChange销毁
		controller.onRouteChange = function() {
			console.log('change'); //可以做一些销毁工作，例如view.undelegateEvents()
			view.remove();
			view = null;
		};
	};
	return controller;
});