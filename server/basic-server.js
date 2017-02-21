var express = require('express');
var app = express();

var appServer = require('./app-server');
var apiServer = require('./api-server');
var login = require('./login');

var bodyParser = require('body-parser');
var cookie = require('cookie-parser');
var morgan = require('morgan');
var path = require('path');

// HEADERS
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

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookie());
app.use('/public', express.static(path.join(__dirname, '/../client')));
app.use(morgan('combined'));

// ROUTERS
app.use('/', login);
app.use('/chat', appServer);
app.use('/classes/messages', apiServer);
app.use(function (req, res, next) {
  res.status(404).send('Sorry can\'t find that!');
});

// SERVER
app.listen(3000, function () {
  console.log('Server is listening on port 3000.');
});