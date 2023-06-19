'use strict';

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const isLogged = req.isAuthenticated();
  res.render('index-page', { title: 'CarRental', isLogged, success:null, 
  message: null});
});

module.exports = router;
