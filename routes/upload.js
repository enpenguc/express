var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

router.post('/', function(req, res) {
	// 获得文件的临时路径
	var tmp_path = req.files.thumbnail.path;

	// 删除临时文件夹文件, 
	fs.unlink(tmp_path, function(err) {
		if (err) throw err;
		res.jsonp({
			path: tmp_path,
			size: req.files.thumbnail.size
		});
	});
});

module.exports = router;
