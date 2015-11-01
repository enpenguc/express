/**
 * 
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 12:42:24
 * @version $Id$
 */
define(['jquery',
	'./indexView.js'
], function($, View) {
	"use strict"
	var controller = function() {
		var view = new View();
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