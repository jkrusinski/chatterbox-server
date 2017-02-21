var express = require('express');
var app = express();

var db = require('diskdb');
db = db.connect(__dirname + '/db', ['messages']);

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

app.use(bodyParser.json());

app.get('/classes/messages', function (req, res) {

  var messages = {};
  messages.results = db.messages.find();

  messages.results.sort((a, b) => {
    if (a.createdAt < b.createdAt) {
      return 1;
    }
    if (a.createdAt > b.createdAt) {
      return -1;
    }
    return 0;
  });

  res.json(messages);
});

app.post('/classes/messages', function (req, res) {

  var message = req.body;

  message.createdAt = new Date();

  db.messages.save(message);

  res.status(201).end();
  
});

app.use(function (req, res, next) {
  res.status(404).send('Sorry can\'t find that!');
});


app.listen(3000, function () {

  console.log('Server is listening on port 3000.');

});