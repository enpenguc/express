var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {

	// var input = '#Welcome\n"1","2","3","4"\n"a","b","c","d"';
	// parse(input, {
	// 	comment: '#'
	// }, function(err, output) {
	// 	console.log(output)
	// });

	res.render('index', {
		title: 'Express'
	});
});

module.exports = router;