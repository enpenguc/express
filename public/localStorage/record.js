/**
 * 订单记录model
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 12:51:52
 * @version $Id$
 */
define(['jquery',
	'backbone',
], function($, Backbone) {

	var record = {}

	record.Model = Backbone.Model.extend({
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
				// 是否未申报清单到货
				noDeclare: false
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

	record.Collection = Backbone.Collection.extend({
		model: record.Model,
		// localStorage
		// localStorage: new Backbone.LocalStorage("order-record-Collection"),
		// 添加一个非申报导入单号记录
		addOneByScanned: function(id) {
			this.add({
				id: id,
				scanned: true,
				scannedCount: 1,
				noDeclare: true
			});
		},
		getTackoutCount: function() {
			return this.where({
				takeout: true
			}).length;
		}
	});

	return record;
});