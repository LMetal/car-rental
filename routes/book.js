'use strict';

const express = require('express');
const router = express.Router();
const dao = require('../models/dao');
const moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
    const isLogged = req.isAuthenticated();
    res.cookie('brand', req.query.brand);
    res.cookie('model', req.query.name);
    dao.getCarInfoByModel(req.query.brand, req.query.name).then((car) =>{
        dao.getCarOptionalByModel(req.query.brand, req.query.name).then((optionals) =>{
            res.cookie('optionals', optionals);
            res.render('book-car-page', { title: 'Informazioni Veicolo', date1: req.cookies.date1, date2:req.cookies.date2, isLogged, car, optionals, moment:moment, success:null, message: null});
        });
    });
});

router.post('/', function(req, res, next) {
    const isLogged = req.isAuthenticated();

    dao.getPlateInfoByModel(req.cookies.brand, req.cookies.model, req.cookies.date1, req.cookies.date2).then((info) => {
        res.cookie('brand', req.query.brand);
        res.cookie('model', req.query.name);
        //se info è null non sono disponibili auto di quel modello
        if(info == null){
            dao.getAllModels().then((models) =>{
                const modelsToShow = models;
                res.render('search-page', {title: 'soluzioni', models, modelsToShow, isLogged, date1: req.query.date1, date2: req.query.date2, moment:moment, success:null, message: 'Modello selezionato non disponibile nelle date selezionate'});
                return;
            });
        } else {
            const optional = req.body;
            dao.getOptionalCosts().then((costs) => {
                const numDays = moment(req.cookies.date2).diff(moment(req.cookies.date1), 'days');
                let cost = info.cost * numDays;
                
                    
                //aggiungi a cost il costo degli optional
                if(optional.Portapacchi != null) cost += costs.find(c => c.name == 'Portapacchi').cost * numDays;
                if(optional.Portabici != null) cost += costs.find(c => c.name == 'Portabici').cost * numDays;
                if(optional['Seggiolino per bambini'] != null) cost += costs.find(c => c.name == 'Seggiolino per bambini').cost * numDays;
                if(optional['Catene da neve'] != null) cost += costs.find(c => c.name == 'Catene da neve').cost * numDays;
                if(optional['Cinghie di carico aggiuntive'] != null) cost += costs.find(c => c.name == 'Cinghie di carico aggiuntive').cost * numDays;
                if(optional['Alimentatore telefono'] != null) cost += costs.find(c => c.name == 'Alimentatore telefono').cost * numDays;
                if(optional.Navigatore != null) cost += costs.find(c => c.name == 'Navigatore').cost * numDays;


                dao.postRent(req.cookies.date1, req.cookies.date2, info.plateId, req.user.EMAIL, cost, optional).then((err) => {
                    if(err != null){
                        res.render('book-car-page', { title: 'Informazioni Veicolo', date1: req.cookies.date1, date2:req.cookies.date2, isLogged, car: req.cookies.car, optionals: req.cookies.optionals, moment:moment, success:null, message: err});
                    }
                    else{
                        res.render('index-page', { title: 'CarRental', isLogged, success: 'Auto prenotata con successo', message: null});
                    }
                });
            });
        }
    });
});

module.exports = router;