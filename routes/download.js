/**
 * 导出文件
 * @authors 冯恩鹏 (enpenguc@163.com)
 * @date    2015-11-03 07:36:52
 * @version $Id$
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var csv = require('csv');
var moment = require("moment");

router.post('/', function(req, res, next) {
	var data = req.param('data');
	var fileName = req.param("name");
	if (!fileName || fileName.trim() === "") {
		fileName = moment().format('YYYYMMDD') + ".csv";
	}
	res.attachment(fileName);
	res.send(new Buffer(data));
	//res.send('respond with a resource');
});

module.exports = router;