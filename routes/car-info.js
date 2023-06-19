'use strict';

const express = require('express');
const moment = require('moment');
const router = express.Router();
const dao = require('../models/dao');

/* GET home page. */
router.get('/', function(req, res, next) {
    const isLogged = req.isAuthenticated();
    dao.getCarInfoByPlate(req.query.plateId).then((car) =>{
        //car not found
        if(car == null){
            res.redirect('/employee-search');
            return;
        }
        //car found
        dao.getCarRentHistoryByPlate(req.query.plateId).then((rentHistory) =>{
            res.render('car-info-page', { title: 'Informazioni Veicolo', isLogged, car, rentHistory, moment, success:null, message: null});
        });
        
    });
    //car not found
    //res.render('employee-search', { title: 'Veicolo non trovato', isLogged, car, rentHistory, message: null});
});

module.exports = router;