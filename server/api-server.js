var express = require('express');
var router = express.Router();
var path = require('path');

var db = require('diskdb');
db = db.connect(path.join(__dirname, '/db'), ['messages']);

router.get('/', function (req, res) {
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

router.post('/', function (req, res) {
  var message = req.body;
  message.createdAt = new Date();
  db.messages.save(message);
  res.status(201).end();
});

module.exports = router;