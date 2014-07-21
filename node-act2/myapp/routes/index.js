var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express',
                        hostname: 'aj-oscon14' });
});

module.exports = router;
