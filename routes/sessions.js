'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');

// Login page user
router.get('/', function(req, res, next) {
  const isLogged = req.isAuthenticated();
  res.render('login-page', {title: 'LOGIN', isLogged, success:null, message: null});
});

// login as user
router.post('/', function(req, res, next) {
  passport.authenticate('user', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
        // display wrong login messages
        const isLogged = req.isAuthenticated();
        return res.render('login-page', {title: 'LOGIN', isLogged, success:null, message: info.message});
    }
    // success, perform the login
    req.login(user, function(err) {
      if (err) { return next(err); }
      // req.user contains the authenticated user
      res.redirect('/index');
    });
  })(req, res, next);
});

// login page employee
router.get('/employee', function(req, res, next) {
  const isLogged = req.isAuthenticated();
  res.render('login-employee-page', {title: 'LOGIN COME DIPENDENTE', isLogged, success:null, message: null});
});

// login as employee
router.post('/employee', function(req, res, next) {
  passport.authenticate('employee', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
        // display wrong login messages
        const isLogged = req.isAuthenticated();
        return res.render('login-employee-page', {title: 'LOGIN COME DIPENDENTE', isLogged, success:null, message: info.message});
    }
    // success, perform the login
    req.login(user, function(err) {
      if (err) { return next(err); }
      // req.user contains the authenticated user
      res.redirect('/employee-search');
    });
  })(req, res, next);
});


router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    const isLogged = req.isAuthenticated();
    res.redirect('/index');

  });
});

module.exports = router;
