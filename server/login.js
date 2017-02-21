var express = require('express');
var router = express.Router();
var path = require('path');

var db = require('diskdb');
db = db.connect(path.join(__dirname, '/db'), ['users']);

var checkLogin = function(req, res, next) {
  if (req.cookies.loggedIn === 'true') {
    res.redirect('/chat');
  } else {
    next();
  }
};

router.get('/', checkLogin, function (req, res) {
  res.sendFile(path.join(__dirname, '/../client/login.html'));
});

router.post('/', function(req, res) {
  var user = req.body.username;
  var pwd = req.body.password;

  var query = db.users.findOne({username: user});

  if (!query) {
    res.status(401).send('User does not exist!');
  } else if (query.password !== pwd) {
    res.status(401).send('Invalid password!');
  } else {
    res.cookie('loggedIn', true);
    res.cookie('username', user);
    res.redirect('/chat');
  }

});

router.get('/signup', checkLogin, function(req, res) {
  res.sendFile(path.join(__dirname, '/../client/signup.html'));
});

router.post('/signup', function(req, res) {
  var user = req.body.username;
  var pwd = req.body.password;
  var pwdCheck = req.body['password-check'];
  
  var query = db.users.findOne({username: user});

  if (query) {
    
    res.status(401).send('This username is already taken.');

  } else if (pwd !== pwdCheck) {

    res.status(401).send('Your passwords do not match.');

  } else {

    db.users.save({username: user, password: pwd});
    res.redirect('/chat');
  }
});

router.get('/logout', function(req, res) {

  res.cookie('loggedIn', false);
  res.clearCookie('username');
  res.redirect('/');
});



module.exports = router;