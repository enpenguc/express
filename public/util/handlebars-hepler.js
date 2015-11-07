/**
 * 清单列表
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 16:24:55
 * @version $Id$
 */
define(['jquery',
	'handlebars',
	'moment',
], function($, Handlebars, Moment) {
	"use strict"

	Handlebars.registerHelper('moment', function(text, format) {
		return Moment(text).format(format || 'YYYY-MM-DD HH:mm:ss');
	});


	Handlebars.registerHelper("compare", function(v1, operator, v2, options) {
		var compare = function() {}
		switch (operator) {
			case "<":
				compare = function(v1, v2) {
					return v1 < v2;
				};
				break;
			case "<=":
				compare = function(v1, v2) {
					return v1 <= v2;
				};
				break;
			case "==":
				compare = function(v1, v2) {
					return v1 == v2;
				};
				break;
			case "===":
				compare = function(v1, v2) {
					return v1 === v2;
				};
				break;
			case ">":
				compare = function(v1, v2) {
					return v1 > v2;
				};
				break;
			case ">=":
				compare = function(v1, v2) {
					return v1 >= v2;
				};
				break;
		}
		var result = compare(v1, v2);
		if (result) {
			//满足添加继续执行
			return options.fn(this);
		} else {
			//不满足条件执行{{else}}部分
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper('exec', function() {
		var expression = [];
		for (var i = 0; i < arguments.length - 1; i++) {
			expression.push("" + arguments[i]);
		}
		return eval(expression.join(""));
	});

	return Handlebars;

});