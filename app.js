'use strict';

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const fileUpload = require('express-fileupload');
const userDao = require('./models/userDao.js');

const indexRouter = require('./routes/index');
var searchRouter = require('./routes/search');
var loginRouter = require('./routes/sessions');
var registerRouter = require('./routes/register');
var carInfoRouter = require('./routes/car-info');
var userInfoRouter = require('./routes/user-info');
var employeeSearchRouter = require('./routes/employee-search');
var bookCarRouter = require('./routes/book')
const { Passport } = require('passport');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//user passport strategy
passport.use('user', new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then(({user, check}) => {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!check) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    })
  }
));

//employee passport strategy
passport.use('employee', new LocalStrategy(
  function(username, password, done) {
    userDao.getEmployee(username, password).then(({user, check}) => {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!check) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  userDao.getUserByEmail(id).then(user => {
    done(null, user);
  });
});

// set up the session
app.use(session({
  secret: 'pass',
  resave: false,
  saveUninitialized: false 
}));

app.use(
  fileUpload({
      limits: {
          fileSize: 10000000,
      },
      abortOnLimit: true,
  })
);

// init passport
app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
  //const aaaa = req.user.type;
  if(req.isAuthenticated() && !req.user.error)
    next();
  else
    res.redirect('/login');
}

const isLoggedInEmployee = (req, res, next) => {
  if(req.isAuthenticated() && req.user.error=='User not found.')
    next();
  else
    res.redirect('/login/employee');
}


app.use('/login', loginRouter);
app.use('/register', registerRouter);

app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/search', searchRouter);
app.use('/book', isLoggedIn, bookCarRouter);

app.use('/employee-search', isLoggedInEmployee, employeeSearchRouter);
app.use('/car-info', isLoggedInEmployee, carInfoRouter);
app.use('/user-info', isLoggedInEmployee, userInfoRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
