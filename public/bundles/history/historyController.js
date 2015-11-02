/**
 * 清单列表
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 16:24:55
 * @version $Id$
 */
define(['jquery',
	'./historyView.js',
	'/LocalStorage/LocalStorage.js'
], function($, View, LocalStorage) {
	"use strict"
	var controller = function() {
		var view = new View({
			collection: LocalStorage.db
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