var express = require('express');
var router = express.Router();

/* GET profile page. */
router.get('/', function(req, res, next) {
  req.session.user = null;
  console.log("logout ayyy");
  res.redirect('/login');
});

module.exports = router;
