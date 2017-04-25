var express = require('express');
var router = express.Router();

/* GET profile page. */
router.get('/', function(req, res, next) {
  if ((req.session && req.session.user) == false) {
  	res.redirect('/login');
  }

  res.render('profile', { title: 'profile' });
});

module.exports = router;
