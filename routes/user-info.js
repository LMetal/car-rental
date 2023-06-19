'use strict';

var express = require('express');
var moment = require('moment');
var router = express.Router();
const dao = require('../models/dao');
const userDao = require('../models/userDao');

/* GET home page. */
router.get('/', function(req, res, next) {
    const isLogged = req.isAuthenticated();
    userDao.getUserByEmail({username: req.query.email}).then((user) =>{
        //car not found
        if(user == null){
            res.redirect('/employee-search');
            return;
        }
        //car found
        dao.getUserRentHistoryByEmail(req.query.email).then((rentHistory) =>{
            res.render('user-info-page', { title: 'Informazioni Utente', isLogged, user, rentHistory, moment, success:null, message: null});
        });
        
    });
});

module.exports = router;