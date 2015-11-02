/**
 * 
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 12:51:52
 * @version $Id$
 */
define(['jquery',
	'backbone',
], function($, _, Backbone) {

	var Model = Backbone.Model.extend({
		// Default attributes for the todo item.  
		defaults: function() {
			return {
				// 包裹编号id
				id: undefined,
				// 需要取出包裹
				takeout: false,
				// 是否已经被扫描到
				scanned: false,
				// 已经被扫描次数,大于1则说明包裹单号重复
				scannedCount: 0,
				// 是否为申报清单导入的
				isImport: true
			};
		},
		scanned: function() {
			var count = this.get("scannedCount");
			this.set({
				scanned: true,
				scannedCount: (count + 1)
			});
		}
	});

	var Collection = Backbone.Collection.extend({
		model: Model,
		// localStorage
		// localStorage: new Backbone.LocalStorage("order-db-backbone"),
		// 添加一个非申报导入单号记录
		addOneByScanned: function(id) {
			this.create({
				id: id,
				takeout: true,
				scanned: true,
				scannedCount: 1,
				isImport: false
			});
		},
		getTackoutCount: function(argument) {
			return this.where({
				takeout: true
			}).length;
		}
	});



	var record = {};

	record.Model = Backbone.Model.extend({
		// Default attributes for the todo item.  
		defaults: function() {
			return {
				// 导入csv名称
				name: "",
				// 是否已经被扫描完成
				complated: false,
				record: []
			};
		},
		initialize: function() {
			var record = this.get("record");
			this.set("record", new Collection(record));
		}
	});

	record.Collection = Backbone.Collection.extend({
		model: record.Model,
		// localStorage
		localStorage: new Backbone.LocalStorage("order-db-backbone"),
		// 添加一个非申报导入单号记录
		// addOneByScanned: function(id) {
		// 	this.create({
		// 		id: id,
		// 		takeout: true,
		// 		scanned: true,
		// 		scannedCount: 1,
		// 		isImport: false
		// 	});
		// },
		// getTackoutCount: function(argument) {
		// 	return this.where({
		// 		takeout: true
		// 	}).length;
		// }
	});


});