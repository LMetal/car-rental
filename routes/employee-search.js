'use strict';

const express = require('express');
const router = express.Router();
const dao = require('../models/dao');
const userDao = require('../models/userDao');
const fileUpload = require('express-fileupload');
const {check, validationResult} = require('express-validator');


/* GET home page. */
router.get('/', function(req, res, next) {
  renderPage(req, res, null, null);
});

router.post('/addcar', [
  check('plateId').matches(/[A-Z]{2}\d{3}[A-Z]{2}/).withMessage('Formato targa non valido')
], function(req, res, next){

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Targa non valida
    const errorMessages = errors.array().map(error => error.msg);
    renderPage(req, res, null, errorMessages[0]);
  } else {
    dao.addCar(req.body.brand, req.body.name, req.body.plateId).then((err) => {
      if(err != null) renderPage(req, res, null, 'Errore');
      else renderPage(req, res, 'Auto registrata', null);
    });
    
  } 
});

router.post('/addmodel', [ 

  check('brand').isLength({ min: 1 }).withMessage('Brand richesto'),
  check('brand').isUppercase().withMessage('Brand deve essere tutto maiuscolo'),
  
  check('name').isLength({ min: 1 }).withMessage('Nome richesto'),
  check('name').matches(/^[A-Z].*/).withMessage('Nome deve avere la iniziale maiuscola'),

  check('seats').isInt({ min: 0 }).withMessage('Posti deve essere un numero positivo'),
  
  check('doors').isInt({ min: 0 }).withMessage('Porte deve essere un numero positivo'),
  
  check('transmission').isIn(['M', 'S']).withMessage('Transmissione errata'),
  
  check('description').isLength({ min: 1 }).withMessage('Descrizione richiesta'),
  
  check('cost').isInt({ min: 0 }).withMessage('Costo deve essere un numero intero positivo'),
  
  check('completeDescription').isLength({ min: 1 }).withMessage('Descrizione completa richiesta')

], async function(req, res, next){

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Targa non valida
    const errorMessages = errors.array().map(error => error.msg);
    renderPage(req, res, null, errorMessages[0]);
  } else {
    const { photo } = req.files;
    if (!photo) return res.sendStatus(400);
    photo.mv('public/images/cars/' + req.body.brand + '-' + req.body.name + '.png');

    dao.addModel(req.body.brand, req.body.name, req.body.seats, req.body.doors, req.body.transmission, req.body.description, req.body.cost, req.body.completeDescription).then((err) => {
      if(err != null) renderPage(req, res, null, 'Errore');
      else renderPage(req, res, 'Auto registrata', null);
    });
  } 
});


function renderPage(req, res, success, message){
  const isLogged = req.isAuthenticated();
  dao.getAllCars().then((cars) =>{
    userDao.getAllUsers().then((users) =>{
      dao.getAllModels().then((models) =>{
        res.render('employee-search', { title: 'CarRental', cars, users, models, isLogged, success, message});
      });
    });
  });
}

module.exports = router;
