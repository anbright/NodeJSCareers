var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user')
var configAuth = require('./auth');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        })
    })

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            process.nextTick(function() {
                User.findOne({
                    'local.email': email
                }, function(err, user) {
                    if (err) {
                        return done(err)
                    }
                    if (user) {
                        return done(null, false, req.flash("signupMessage", "Email in use"))
                    } else {
                        var newUser = new User()
                        newUser.local.email = email;
                        newUser.completed = false;
                        newUser.local.password = newUser.generateHash(password)
                        newUser.save(function(err) {
                            if (err) {
                                throw err;
                            }
                            req.session.user = user;
                            return done(null, newUser);
                        })
                    }
                })
            })
        }))

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            User.findOne({
                'local.email': email
            }, function(err, user) {
                if (err) {
                    return done(err)
                }
                if (!user) {
                    return done(null, false, req.flash('loginMessage', "Email or password is incorrect"))
                }
                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('loginMessage', "Email or password is incorrect"))
                }
                req.session.user = user;

                return done(null, user)
            })
        }))

    passport.use(new FacebookStrategy({
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            passReqToCallback: true,
            profileFields: ['id', 'email', 'first_name', 'last_name']
        },
        function(req, token, refreshToken, profile, done) {
            process.nextTick(function() {
                User.findOne({
                    'facebook.id': profile.id
                }, function(err, user) {
                    if (err) {
                        return done(err)
                    }
                    if (user) {
                        req.session.user = user;
                        done(null, user)
                    } else {
                        var newUser = new User()
                        newUser.facebook.id = profile.id
                        newUser.facebook.token = token
                        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName
                        newUser.facebook.email = (profile.emails[0].value || '').toLowerCase()
                        newUser.completed = false;
                        newUser.save(function(err) {
                            if (err) {
                                throw (err)
                            }
                            req.session.user = user;
                            return done(null, newUser)
                        })
                    }
                })
            })
        }))

    passport.use(new GoogleStrategy({
            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL,
            passReqToCallback: true
        },
        function(req, token, refreshToken, profile, done) {
            process.nextTick(function() {
                User.findOne({
                    'google.id': profile.id
                }, function(err, user) {
                    if (err)
                        return done(err)
                    if (user) {
                        req.session.user = user
                        return done(null, user)
                    } else {
                        var newUser = new User()
                        newUser.google.id = profile.id
                        newUser.google.token = token
                        newUser.google.name = profile.displayName
                        newUser.google.email = profile.emails[0].value
                        newUser.completed = false;
                        newUser.save(function(err) {
                            if (err)
                                throw err
                            req.session.user = user
                            return done(null, newUser)
                        });
                    }
                });
            });
        }));
}
