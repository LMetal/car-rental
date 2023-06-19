'use strict';

var express = require('express');
var router = express.Router();
const dao = require('../models/dao');
const userDao = require('../models/userDao');
const filters = require('../filters');
const {check, validationResult} = require('express-validator');



/* GET home page. */
router.get('/', function(req, res, next) {
    const isLogged = req.isAuthenticated();
    res.render('register-page', {title: 'REGISTRATI', isLogged, success:null, message: null, date:null});
});


router.post('/', [
  check('nome').notEmpty().withMessage('Name is required'),
  check('cognome').notEmpty().withMessage('Surname is required'),
  check('email').isEmail().withMessage('Invalid email'),
  check('pass1').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  check('pass1').matches(/\d/).withMessage('Password must contain at least one numeral')
], async function(req, res, next) {
  const errors = validationResult(req);
  const isLogged = req.isAuthenticated;

  if (!errors.isEmpty()) {
    // Campi non validi
    const errorMessages = errors.array().map(error => error.msg);
    res.render('register-page', { title: 'REGISTRATI', isLogged, message: errorMessages[0], success:null });
  } else {
    try {
      // Campi validi, creo nuovo utente
      await userDao.registerUser(req.body.nome, req.body.cognome, req.body.email, req.body.data, req.body.pass1);
      res.redirect('/index');
    } catch (error) {
      res.render('register-page', { title: 'REGISTRATI', isLogged: false, success:null, message: 'Email alreary registered' });
    }
  }
});



module.exports = router;