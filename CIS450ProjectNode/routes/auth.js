var express = require('express');
var passport = require('passport');
var router = express.Router();

require('../config/passport')(passport)

/* GET users listing. */
router.get('/login', function(req, res, next) {
    if ((req.session != undefined && req.session.user != undefined)) {
        res.redirect('/profile');
    }

    res.render('login', {
        message: req.flash('loginMessage')
    });

});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));


// NEW
// router.post('/signup', function(req, res, next) {
//   req.session.email = req.body.email
//   req.session.password = req.body.password
//   req.session.
// });

// OLD
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true,
}));

router.get('/signup', function(req, res, next) {
    res.render('signup', {
        message: req.flash('signupMessage')
    });
});

router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
}));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/',
}));

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/',
}));

module.exports = router;