var express = require('express');
var router = express.Router();
var session = require('express-session')


/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session && req.session.user) {
	res.redirect('/profile');
  }
  else {
	res.redirect('/login');
  }

});

module.exports = router;
