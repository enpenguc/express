/**
 * 
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 12:10:13
 * @version $Id$
 */
define(['backbone'], function(Backbone) {
	"use strict"
	var Router = Backbone.Router.extend({
		routes: {
			"history": "history",
			"list": "list",
			"list/:id": "list",
			"scan": "scanning",
			"scan/:id": "scanning",
			// "search/:query": "search", // #search/kiwis
			// "search/:query/p:page": "search", // #search/kiwis/p7
			// 'index': '/bundles/index/indexController.js',
			// 默认index
			// '*path': 'index',
			'*actions': 'index' //
		},
		defaultAction: function() {
			console.log('404');
			// location.hash = 'module2';
		}
	});

	var router = new Router();
	//彻底用on route接管路由的逻辑，这里route是路由对应的value
	router.on('route', function(route, params) {
		//这里route是路由对应的方法名
		console.log('hash change', arguments);
		// 原来应该是一个方法名，这里取巧改为模块路径
		var controller = '/bundles/{{route}}/{{route}}Controller.js'.replace(/{{route}}/g, route);
		console.log(controller);
		require([controller], function(controller) {
			if (router.currentController && router.currentController !== controller) {
				router.currentController.onRouteChange && router.currentController.onRouteChange();
			}
			router.currentController = controller;
			controller.apply(null, params); //每个模块约定都返回controller
		});
	});

	//这里必须的，让路由表执行
	return router;
});