var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//auth
var passport = require('passport')
var LocalStrategy = require('passport-local').strategy
var mongoose = require('mongoose')
var flash = require('connect-flash')
var session = require('express-session')



var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: 'secret'})) //change in production
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


// ROUTES
var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var profile = require('./routes/profile');
var signout = require('./routes/signout');
var testrds = require('./routes/testrds');
var details = require('./routes/details');
var alumni = require('./routes/alumni');
var careers = require('./routes/careers');
var explore = require('./routes/explore');
var map = require('./routes/map');
var company = require('./routes/company');

app.use('/', index);
app.use('/', auth);
app.use('/users', users);
app.use('/profile', profile);
app.use('/signout', signout);
app.use('/details', details);
app.use('/testrds', testrds);
app.get('/alumni', alumni);
app.post('/alumni', alumni);
app.get('/careers', careers);
app.post('/careers', careers);
app.get('/explore', explore);
app.post('/explore', explore);
app.use('/map', map);
app.use('/company', company);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
