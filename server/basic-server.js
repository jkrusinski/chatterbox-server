var express = require('express');
var app = express();

var path = require('path');

var appServer = require('./app-server');
var apiServer = require('./api-server');


var bodyParser = require('body-parser');


app.use(function (req, res, next) {
  res.header('access-control-allow-origin', '*');
  res.header('access-control-allow-methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('access-control-allow-headers', 'content-type, accept');
  res.header('access-control-max-age', 10);

  if ('OPTIONS' === req.method) {

    res.send(200);

  } else {

    // move on
    next();
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/../client')));

app.use(appServer);

app.use('/classes/messages', apiServer);

app.use(function (req, res, next) {
  res.status(404).send('Sorry can\'t find that!');
});


app.listen(3000, function () {

  console.log('Server is listening on port 3000.');

});