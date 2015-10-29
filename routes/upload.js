var express = require('express');
var router = express.Router();
var formidable = require('formidable'),
	fs = require('fs'),
	TITLE = 'formidable上传示例',
	AVATAR_UPLOAD_FOLDER = '/upload/'

// var multipart = require('connect-multiparty');
// var multipartMiddleware = multipart();
// router.post('/', multipartMiddleware, function(req, resp) {
//   console.log(req.body, req.files);
//   // don't forget to delete all req.files when done 
// });

// router.post('/', function(req, res) {
// 	var form = new formidable.IncomingForm(); //创建上传表单
// 	form.encoding = 'utf-8'; //设置编辑
// 	form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER; //设置上传目录
// 	form.keepExtensions = true; //保留后缀
// 	form.maxFieldsSize = 2 * 1024 * 1024; //文件大小

// 	form.parse(req, function(err, fields, files) {

// 		if (err) {
// 			res.locals.error = err;
// 			res.render('index', {
// 				title: TITLE
// 			});
// 			return;
// 		}

// 		var extName = ''; //后缀名
// 		switch (files.fulAvatar.type) {
// 			case 'image/pjpeg':
// 				extName = 'jpg';
// 				break;
// 			case 'image/jpeg':
// 				extName = 'jpg';
// 				break;
// 			case 'image/png':
// 				extName = 'png';
// 				break;
// 			case 'image/x-png':
// 				extName = 'png';
// 				break;
// 		}

// 		if (extName.length == 0) {
// 			res.locals.error = '只支持png和jpg格式图片';
// 			res.render('index', {
// 				title: TITLE
// 			});
// 			return;
// 		}

// 		var avatarName = Math.random() + '.' + extName;
// 		var newPath = form.uploadDir + avatarName;

// 		console.log(newPath);
// 		fs.renameSync(files.fulAvatar.path, newPath); //重命名
// 	});

// 	res.locals.success = '上传成功';
// 	res.render('index', {
// 		title: TITLE
// 	});
// });

router.post('/', function(req, res) {
	// 获得文件的临时路径
	var tmp_path = req.files.thumbnail.path;
	console.log(tmp_path);
	// 指定文件上传后的目录 - 示例为"upload"目录。 
	var target_path = './public/upload/' + req.files.thumbnail.name;
	// 移动文件
	fs.rename(tmp_path, target_path, function(err) {
		if (err) throw err;
		// 删除临时文件夹文件, 
		fs.unlink(tmp_path, function() {
			if (err) throw err;
			res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
		});
	});
});

module.exports = router;