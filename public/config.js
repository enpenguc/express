/**
 * 
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 12:12:13
 * @version $Id$
 */
(function(win) {
	//配置baseUrl
	var baseUrl = document.getElementById('main').getAttribute('data-baseurl');

	/*
	 * 文件依赖
	 */
	var config = {
		baseUrl: baseUrl, //依赖相对路径
		paths: { //如果某个前缀的依赖不是按照baseUrl拼接这么简单，就需要在这里指出
			// zepto: 'libs/zepto.min',
			jquery: '/jquery/dist/jquery.min',
			bootstrap: '/bootstrap/dist/js/bootstrap',
			handlebars: '/handlebars/handlebars.amd.min',
			underscore: '/underscore/underscore',
			backbone: '/backbone/backbone',
			"backbone.localStorage": '/backbone.localStorage/backbone.localStorage',
			text: 'text/text', //requirejs-text插件:用于requirejs导入html类型的依赖
			"bootstrap-fileinput": "/bootstrap-fileinput/js/fileinput",
			"bootstrap-fileinput-locale": "/bootstrap-fileinput/js/fileinput_locale_zh"
		},
		shim: { //引入没有使用requirejs模块写法的类库。backbone依赖underscore
			'underscore': {
				exports: '_'
			},
			'jquery': {
				exports: '$'
			},
			'handlebars': {
				exports: 'Handlebars'
			},
			'bootstrap': {
				deps: ['jquery'],
			},
			'backbone': {
				deps: ['underscore', 'jquery'],
				exports: 'Backbone'
			}
		}
	};

	require.config(config);

	//Backbone会把自己加到全局变量中
	require(['backbone', 'underscore', 'router'], function() {
		Backbone.history.start(); //开始监控url变化
	});

})(window);