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
			"import": "import",
			// "search/:query": "search", // #search/kiwis
			// "search/:query/p:page": "search", // #search/kiwis/p7
			// 'index': '/bundles/index/indexController.js',
			// 默认index
			// '*path': 'index',
			'*actions': 'import' //
		},
		options: {
			dbStorage: undefined
		},
		initialize: function(options) {
			this.options = _.extend({}, _.result(this, 'options'), options || {});
			this.listenTo(this, "route", this.onRoute);
		},
		// defaultAction: function() {
		// 	console.log('404');
		// 	// location.hash = 'module2';
		// },
		// 彻底用on route接管路由的逻辑，这里route是路由对应的value
		onRoute: function(route, params) {
			//这里route是路由对应的方法名
			// console.log('hash change', arguments);
			var router = this;
			// 取巧模块路径
			var controller = '/bundles/{{route}}/{{route}}Controller.js'.replace(/{{route}}/g, route);
			// console.log(controller);
			require([controller], function(controller) {
				if (router.currentController && router.currentController !== controller) {
					router.currentController.destroy();
				}
				router.currentController = new controller({
					router: router,
					dbStorage: router.options.dbStorage,
					params: params
				});
			});
		}
	});
	//这里必须的，让路由表执行
	return Router;
});