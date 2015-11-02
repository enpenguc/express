/**
 * 
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 12:51:52
 * @version $Id$
 */
define(['jquery',
	'underscore',
	'backbone',
	'backbone.localStorage'
], function($, _, Backbone) {

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



	var dbSorage = {};

	dbSorage.Model = Backbone.Model.extend({
		// Default attributes for the todo item.  
		defaults: function() {
			return {
				// 导入csv名称
				name: "",
				// 是否已经被扫描完成
				complated: false,
				record: [],
				count: 0,
				ctime: new Date()
			};
		},
		initialize: function() {
			var d = this.get("record");
			this.set("record", new record.Collection(d));
			this.set("count", this.get("record").length);
			this.listenTo(this.get("record"), "change", this.onRecordChang);
			this.listenTo(this.get("record"), "add", this.onRecordAdd);
			_.bindAll(this, "getCollection", "complated");
			return this;
		},
		toJSON: function() {
			var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
			json.record = this.get('record').toJSON();
			return json;
		},
		getExport: function() {
			var collection = this.get('record');

			var arrOrigin = collection.where({
				noDeclare: false
			});
			var arrTakeout = collection.where({
				takeout: true,
				scanned: true
			});
			var arrNoDeclare = collection.where({
				noDeclare: true
			});
			var arrNoScanned = collection.where({
				scanned: false
			});
			var arrChongfu = = collection.where(function(item) {
				return item.scannedCount > 1;
			});
			var arr = [],
				tmp = []
			for (var i = 0; i < arrOrigin.length; i++) {
				tmp = [
					arrOrigin[i],
					arrTakeout[i] ? arrTakeout[i] : "",
					arrNoDeclare[i] ? arrNoDeclare[i] : "",
					arrNoScanned[i] ? arrNoScanned[i] : "",
					arrChongfu[i] ? (arrChongfu[i] + "重复" + arrChongfu[i].scannedCount + "次") : ""
				]
				arr.push(tmp.join(","))
			}
			return arr.join("\r\n");
		},
		getCollection: function() {
			return this.get("record");
		},
		complated: function() {
			this.set("complated", true);
			this.save();
		},
		onRecordAdd: function() {
			this.set("count", this.get("record").length);
			this.save();
		},
		onRecordChang: function() {
			this.save();
		}
	});

	dbSorage.Collection = Backbone.Collection.extend({
		model: dbSorage.Model,
		comparator: "ctime",
		// localStorage
		localStorage: new Backbone.LocalStorage("order-db-backbone"),
		getLast: function() {
			var model = this.last();
			return model && model.get("complated") ? null : model;
		},
		addRecord: function(data) {
			var model = new dbSorage.Model({
				name: data.name,
				record: data.items
			});
			this.create(model);
			return model;
		},
		getLastCollection: function() {
			var model = this.getLast(),
				collection;
			if (model) {
				collection = model.get("record");
			}
			return collection;
		},
		getLastCollectionData: function() {
			var model = this.getLast(),
				data = [];
			if (model) {
				data = model.get("record").toJSON();
			}
			return data;
		}
	});

	var db = new dbSorage.Collection();
	db.fetch();

	return {
		record: record,
		db: db
	}
});