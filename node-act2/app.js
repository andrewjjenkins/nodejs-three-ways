var express = require('express');

var app = express();

app.get('/', function (req, res) {
  res.send("Hello");
});

var server = app.listen(3000, function () {
  console.log('Listening on 3000');
});
