'use strict';

const express = require('express');
const moment = require('moment');
const router = express.Router();
const dao = require('../models/dao');
const filters = require('../filters');

/* GET home page. */
router.get('/', function(req, res, next) {
  const isLogged = req.isAuthenticated();
  res.cookie('date1', req.query.date1);
  res.cookie('date2', req.query.date2);

  if(!filters.areValid(req.query.date1, req.query.date2)){
    return res.render('index-page', { title: 'CarRental', isLogged, success:null, message: 'Date inserite non coerenti'});
  }

  dao.getAllModels().then((models) =>{
    const modelsToShow = models;
    res.render('search-page', {title: 'SOLUZIONI', models, modelsToShow, isLogged, date1: req.query.date1, date2: req.query.date2, moment:moment, success:null, message: null});
  });
});

router.get('/filter', function(req, res, next) {
  const isLogged = req.isAuthenticated();
  dao.getAllModels().then((models) =>{
    const modelsToShow = filters.filterModels(models, req);   //filter
    res.render('search-page', {title: 'SOLUZIONI', models, modelsToShow, isLogged, date1: req.cookies.date1, date2: req.cookies.date2, moment:moment, success:null, message: null});
  });
});

router.get('/model', function(req, res, next) {
  const isLogged = req.isAuthenticated();

  dao.getAllModels().then((models) =>{
    dao.getCarInfoByModel(req.query.brand, req.query.name).then((modelToShow) =>{
      if(modelToShow == null){
        res.render('search-page', {title: 'SOLUZIONI', models, modelsToShow: models, isLogged, date1: req.cookies.date1, date2: req.cookies.date2, moment:moment, success:null, message: 'Modello non trovato'});
      }
      const modelsToShow = Array.from([modelToShow]);
      res.render('search-page', {title: 'SOLUZIONI', models, modelsToShow, isLogged, date1: req.cookies.date1, date2: req.cookies.date2, moment:moment, success:null, message: null});
    })
  });
});





module.exports = router;
