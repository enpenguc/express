/**
 * App入口
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-07 11:42:37
 * @version $Id$
 */

require([
	'backbone',
	'router',
	'dbStorage'
], function(Backbone, Router, DBStorage) {

	var dbStorage = new DBStorage();
	var router = new Router({
		dbStorage: dbStorage
	});
	window.appRouter = router;

	Backbone.history.start(); //开始监控url变化
});