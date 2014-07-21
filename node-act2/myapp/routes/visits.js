var express = require('express')
  , Visit = require('../models/visit.js')
;

var router = express.Router();

router.get('/', function (req, res) {
  var query = Visit.find(); // Everything
  query.sort({date: -1});
  query.exec(function(err, visits) {
    res.render('visits', { my_name: "Andrew",
                           date: new Date() + '',
                           visits: visits });
  });
});

module.exports = router;
