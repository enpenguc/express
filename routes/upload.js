var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var csv = require('csv');

var getData = function(name, output) {
	// 所有运单
	var arr = [],
		// 取出单号
		takeOut = [],
		item;
	for (var i = 0; i < output.length; i++) {
		if (i === 0) {
			continue;
		}
		item = output[i];
		if (!item || !item[0]) {
			break;
		}
		arr.push({
			id: item[0],
			takeout: false
		});
		if (item[1]) {
			takeOut.push(item[1]);
		}
	}

	for (var i = 0; i < takeOut.length; i++) {
		item = takeOut[i];
		for (var j = 0; j < arr.length; j++) {
			if (item === arr[j].id) {
				arr[j].takeout = true;
				break;
			}
		}
	}

	return {
		name: name,
		items: arr,
		takeOut: takeOut
	}
}

router.post('/', function(req, res) {
	// 获得文件的临时路径
	var tmp_path = req.files.thumbnail.path;
	// var name = path.basename(req.files.thumbnail.originalFilename, 'csv');
	var name = req.files.thumbnail.originalFilename;
	var parse = csv.parse;

	var callback = function(err, output) {
		if (err) {
			res.jsonp({
				error: err,
				success: false
			});
		} else {
			var d = getData(name, output);
			res.jsonp({
				data: d,
				success: true
			});
		}
	}
	try {
		var data = fs.readFileSync(tmp_path, 'utf8');
		parse(data, {
			comment: '#'
		}, function(err, output) {
			if (err) {
				return callback(err);
			}
			callback(null, output)
		});
	} catch (e) {
		errCall(e);
	} finally {
		// 删除临时文件夹文件, 
		fs.unlink(tmp_path, function(err) {
			if (err) {
				console.log("删除文件失败:" + tmp_path);
			};
		});
	}
});

module.exports = router;