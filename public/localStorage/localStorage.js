/**
 * 
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-01 12:51:52
 * @version $Id$
 */
define(['jquery',
	'underscore',
	'./record.js',
	'backbone',
	'backbone.localStorage'
], function($, _, Record, Backbone) {

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
			this.set("count", d.length);

			this.set("recordCollection", new Record.Collection(d));
			this.listenTo(this.get("recordCollection"), "change", this.onRecordChange);
			this.listenTo(this.get("recordCollection"), "add", this.onRecordAdd);
			_.bindAll(this, "getRecordCollection", "complated");
			return this;
		},
		toJSON: function() {
			var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
			json.record = this.get('recordCollection').toJSON();
			delete json.recordCollection;
			return json;
		},
		// 获取记录集合
		getRecordCollection: function() {
			return this.get("recordCollection");
		},
		// 获取导出csv的数据
		getExportCsv: function() {
			var collection = this.getRecordCollection();

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
			var arrChongfu = collection.where(function(item) {
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
		complated: function() {
			this.save({
				complated: true
			});
		},
		onRecordAdd: function() {
			// this.set("count", this.get("recordCollection").length);
			this.save({
				record: this.get("recordCollection").toJSON(),
				count: this.get("recordCollection").length
			});
		},
		onRecordChange: function() {
			this.save({
				record: this.get("recordCollection").toJSON()
			});
			// this.save();
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
				collection = model.get("recordCollection");
			}
			return collection;
		},
		getLastCollectionData: function() {
			var model = this.getLast(),
				data = [];
			if (model) {
				data = model.get("recordCollection").toJSON();
			}
			return data;
		}
	});

	var db = new dbSorage.Collection();
	db.fetch();

	window.db = db;

	return {
		db: db
	}
});