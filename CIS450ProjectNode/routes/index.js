var express = require('express');
var router = express.Router();
var session = require('express-session')


/* GET home page. */
router.get('/', function(req, res, next) {
  if ((req.session == undefined || req.session.user == undefined)) {
  		res.redirect('/login');
  }
  else {
	  res.render('profile', { title: 'profile' });
  }


});

module.exports = router;
