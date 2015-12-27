/**
 * express model
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-07 10:53:02
 * @version $Id$
 */
define(['jquery',
	'backbone',
], function($, Backbone, express) {

	// 一个order订单记录
	var Order = Backbone.Model.extend({
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
		setScanned: function() {
			var count = this.get("scannedCount");
			this.set({
				scanned: true,
				scannedCount: (count + 1)
			});
		}
	});

	// order记录集合
	var Record = Backbone.Collection.extend({
		model: Order,
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

	var Log = Backbone.Model.extend({
		defaults: function() {
			return {
				// 包裹编号orderId
				orderId: undefined,
				// 状态
				status: "Success",
				// 消息
				msg: "",
				// 日志
				ctime: new Date().getTime()
			};
		}
	});

	var Logs = Backbone.Collection.extend({
		model: Log,
		comparator: function(obj1) {
			return -obj1.get("ctime");
		}
	});


	// express:一个批次的order
	var Express = Backbone.Model.extend({
		defaults: function() {
			return {
				// 导入csv名称
				name: "",
				// 是否已经被扫描完成
				complated: false,
				// 订单列表
				record: [],
				// 扫描日志
				logs: [],
				// 清单总计
				count: 0,
				// 需要取出计数
				countTakeout: 0,
				// 已经扫描
				countScanned: 0,
				// 到货未申报
				countNoDeclare: 0,
				// 导入时间
				ctime: new Date()
			};
		},
		initialize: function() {
			// orders
			var d = this.get("record");
			var collection = new Record(d);
			this.set("recordCollection", collection, {
				silent: true
			});
			// logs
			var logCollection = new Logs(this.get("logs"));
			this.set("logCollection", logCollection);

			//listen
			this.listenTo(collection, "add change", this.saveChange);

			// this.listenTo(collection, "change", this.onRecordChange);
			// this.listenTo(collection, "add", this.onRecordAdd);
			_.bindAll(this, "getRecordCollection", "complated");
			// 计数统计
			this.computeCount();
		},
		computeCount: function() {
			var collection = this.getRecordCollection();
			this.set({
				"count": collection.length,
				"countTakeout": collection.where({
					takeout: true
				}).length,
				"countScanned": collection.where({
					scanned: true
				}).length,
				"countNoDeclare": collection.where({
					noDeclare: true
				}).length
			});
		},
		toJSON: function() {
			var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
			json.record = json.recordCollection.toJSON();
			json.logs = json.logCollection.toJSON();
			delete json.recordCollection;
			delete json.logCollection;
			return json;
		},
		// 获取记录集合
		getRecordCollection: function() {
			return this.get("recordCollection");
		},
		getLogCollection: function() {
			return this.get("logCollection");
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
				return item.get("scannedCount") > 1;
			});
			var arr = ["原始清单,取出包裹,到货未申报,申报未到货,重复单号"],
				tmp = []
			for (var i = 0; i < arrOrigin.length; i++) {
				tmp = [
					arrOrigin[i].id,
					arrTakeout[i] ? arrTakeout[i].id : "",
					arrNoDeclare[i] ? arrNoDeclare[i].id : "",
					arrNoScanned[i] ? arrNoScanned[i].id : "",
					arrChongfu[i] ? (arrChongfu[i].id + "重复" + arrChongfu[i].get("scannedCount") + "次") : ""
				]
				arr.push(tmp.join(","));
			}
			return arr.join("\r\n");
		},
		// 设置当前记录完成状态
		complated: function() {
			this.save({
				complated: true
			});
		},
		// 扫描
		scanning: function(orderId) {
			var collection = this.getRecordCollection(),
				logCollection = this.getLogCollection();
			if (!collection) {
				return;
			}
			var model = collection.get(orderId);
			if (model) {
				var scannedCount = model.get("scannedCount"),
					takeout = model.get("takeout"),
					status,
					msg;
				if (takeout) {
					status = "Warning";
					msg = "需要取出包裹：" + orderId;
				} else if (scannedCount > 0) {
					// 重复
					status = "Error";
					msg = "重复包裹：" + orderId + ", 重复" + scannedCount + "次";
				} else {
					status = "Success";
					msg = "成功扫描：" + orderId;
				}
				// log日志
				var log = logCollection.add({
					orderId: orderId,
					status: status,
					takeout: takeout,
					scannedCount: scannedCount,
					msg: msg
				});
				model.setScanned();
				return log;
			} else {
				// log日志
				var log = logCollection.add({
					orderId: orderId,
					status: "Info",
					msg: "未申报到货：" + orderId
				});
				collection.addOneByScanned(orderId);
				return log;
			}
		},
		// onRecordAdd: function() {
		// 	this.computeCount();
		// 	this.save({
		// 		record: this.get("recordCollection").toJSON(),
		// 		count: this.get("recordCollection").length
		// 	});
		// },
		// onRecordChange: function() {
		// 	this.computeCount();
		// 	this.save({
		// 		record: this.get("recordCollection").toJSON()
		// 	});
		// },
		saveChange: function() {
			console.log("saveChange")
			this.computeCount();
			this.save();
			// this.set("record", this.get("recordCollection").toJSON());
		}
	});

	return {
		Order: Order,
		Record: Record,
		Express: Express
	};
});