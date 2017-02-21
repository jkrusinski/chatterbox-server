var express = require('express');
var router = express.Router();
var path = require('path');

var authenticate = function(req, res, next) {
  if (req.cookies.loggedIn !== 'true') {
    res.redirect('/');
  } else {
    next();
  }
};

router.get('/', authenticate, function (req, res) {
  res.sendFile(path.join(__dirname, '/../client/index.html'));
});

module.exports = router;