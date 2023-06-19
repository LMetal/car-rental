'use strict';

const db = require('../db.js');
var moment = require('moment');

// ritorna una lista di modelli prenotabili
exports.getAllModels = function() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM model';
        db.all(sql, (err, rows) => {
        if (err) {
            reject(err);
            return;
        }

        const models = rows.map((c) => ({
                                            name: c.NAME, 
                                            brand: c.BRAND, 
                                            seats: c.n_posti,
                                            doors: c.n_porte,
                                            transmission: c.trasmissione,
                                            description: c.descrizione,
                                            cost: c.costo
                                        }));
        resolve(models);
        });
    });
};

// ritorna le informazioni di una auto dato il modello
exports.getCarInfoByModel = function(brand, name) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM model WHERE model.NAME == ? AND model.BRAND == ?';
        db.get(sql, [name, brand], (err, car) => {
        if (err) {
            reject(err);
            return;
        }

        if(car == undefined){
            resolve(null);
            return;
        }

        const carInfo = {
                    name: car.NAME, 
                    brand: car.BRAND, 
                    seats: car.n_posti,
                    doors: car.n_porte,
                    transmission: car.trasmissione,
                    description: car.descrizione,
                    cost: car.costo,
                    completeDescription: car.descrizioneCompleta
                        };
        resolve(carInfo);
        });
    });
};

// ritorna le informazioni di una auto data la targa
exports.getCarInfoByPlate = function(plate) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM car JOIN model ON car.name = model.NAME AND car.brand = model.BRAND WHERE car.PLATE_ID=?';
        db.get(sql, [plate], (err, car) => {
        if (err) {
            reject(err);
            return;
        }

        if(car == undefined){
            resolve(null);
            return;
        }

        const carInfo = {
                            plateId: car.PLATE_ID, 
                            name: car.name, 
                            brand: car.brand,
                            kmTraveled: car.km_traveled,
                            n_posti: car.n_posti,
                            n_porte: car.n_porte,
                            transmission: car.trasmissione,
                            description: car.descrizione
                        };
        resolve(carInfo);
        });
    });
};


// ritorna la lista degli affitti di una auto data la targa
exports.getCarRentHistoryByPlate = function(plate) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM affitti WHERE affitti.AUTO=?';
        db.all(sql, [plate], (err, rents) => {
        if (err) {
            reject(err);
            return;
        }

        const storicoAffitti = rents.map((rent) => ({
                                    user: rent.UTENTE, 
                                    startDate: rent.data_inizio,
                                    endDate: rent.data_fine,
                                    cost: rent.costo,
                                    portapacchi: rent.Portapacchi,
                                    portabici: rent.Portabici,
                                    seggiolino: rent.Seggiolino,
                                    catene: rent.Catene,
                                    cinghie: rent.Cinghie,
                                    alimentatore: rent.Alimentatore,
                                    navigatore: rent.Navigatore
                                }));

        //sort
        storicoAffitti.sort((a, b) => {
            const startDateA = moment(a.startDate, 'YYYY/MM/DD');
            const startDateB = moment(b.startDate, 'YYYY/MM/DD');
            
            if (startDateA.isBefore(startDateB)) {
              return 1;
            } else if (startDateA.isAfter(startDateB)) {
              return -1;
            } else {
              return 0;
            }
          });

        resolve(storicoAffitti);
        });
    });
};

// ritorna la lista degli affitti di una utente data l'email
exports.getUserRentHistoryByEmail = function(email) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM affitti a JOIN car c ON a.AUTO = c.PLATE_ID WHERE a.UTENTE = ?';
        db.all(sql, [email], (err, rents) => {
        if (err) {
            reject(err);
            return;
        }

        const storicoAffitti = rents.map((rent) => ({
                                    startDate: rent.data_inizio,
                                    endDate: rent.data_fine,
                                    cost: rent.costo,
                                    portapacchi: rent.Portapacchi,
                                    portabici: rent.Portabici,
                                    seggiolino: rent.Seggiolino,
                                    catene: rent.Catene,
                                    cinghie: rent.Cinghie,
                                    alimentatore: rent.Alimentatore,
                                    navigatore: rent.Navigatore,
                                    brand: rent.brand, 
                                    name: rent.name,
                                    plateId: rent.AUTO
                                }));

        //sort
        storicoAffitti.sort((a, b) => {
            const startDateA = moment(a.startDate, 'YYYY/MM/DD');
            const startDateB = moment(b.startDate, 'YYYY/MM/DD');
            
            if (startDateA.isBefore(startDateB)) {
              return 1;
            } else if (startDateA.isAfter(startDateB)) {
              return -1;
            } else {
              return 0;
            }
          });

        resolve(storicoAffitti);
        });
    });
};


// ritorna una lista di modelli prenotabili
exports.getCarOptionalByModel = function(brand, name) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT optional.optional, optional_cost.cost FROM optional JOIN optional_cost ON optional.optional = optional_cost.NAME WHERE optional.brand = ? AND optional.name = ?';
        db.all(sql, [brand, name], (err, rows) => {
        if (err) {
            reject(err);
            return;
        }

        const optionals = rows.map((o) => ({
                                            optional: o.optional,
                                            costoOptional: o.cost
                                        }));
        resolve(optionals);
        });
    });
};


exports.postRent = function(date1, date2, plateId, user, cost, optional){
    const portapacchi = optional.Portapacchi;
    const portabici = optional.Portabici;
    const seggiolino = optional['Seggiolino per bambini'];
    const catene = optional['Catene da neve'];
    const cinghie = optional['Cinghie di carico aggiuntive'];
    const alimentatore = optional['Alimentatore telefono'];
    const navigatore = optional.Navigatore;

    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO affitti("AUTO", "UTENTE", "data_inizio", "data_fine", "costo", "Portapacchi", "Portabici", "Seggiolino", "Catene", "Cinghie", "Alimentatore", "Navigatore") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
        db.run(sql, [plateId, user, date1, date2, cost, portapacchi, portabici, seggiolino, catene, cinghie, alimentatore, navigatore], (err) => {
            if (err){
                resolve('Auto già prenotata');
            }
                
            else
                resolve();
        });
    });
}


// ritorna una auto prenotabile in tali date
exports.getPlateInfoByModel = function(brand, name, date1, date2) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT c.PLATE_ID, m.costo FROM car c JOIN model m ON c.name = m.NAME AND c.brand = m.BRAND WHERE m.BRAND = ? AND m.NAME = ? AND NOT EXISTS (SELECT * FROM affitti a WHERE a.AUTO = c.PLATE_ID AND ((a.data_inizio <= ? AND a.data_fine >= ?) OR (a.data_inizio >= ? AND a.data_fine <= ?) OR (a.data_inizio <= ? AND a.data_fine >= ?)));';
        
        //get per ritornate la prima soluzione
        db.get(sql, [brand, name, date2, date1, date1, date2, date1, date2], (err, car) => {
            if (err) {
                reject(err);
                return;
            }

            //nessuna auto trovata libera in tali giorni
            if(car == undefined){
                resolve(null);
                return;
            }

            const info = {plateId: car.PLATE_ID, cost: car.costo};
            resolve(info);
        });
    });
};

// ritorna i costi degli optional
exports.getOptionalCosts = function(){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM optional_cost';
        db.all(sql, (err, costs) => {
            if (err) {
                reject(err);
                return;
            }

            const opCost = costs.map((c) => ({
                name: c.NAME,
                cost: c.cost
            }));
            resolve(opCost);
        });
    }
)};


// ritorna le informazioni(targa, brand, modello) di tutte le auto
exports.getAllCars = function(){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT c.PLATE_ID, m.brand, m.name FROM car c JOIN model m on m.brand = c.brand AND m.name = c.name';
        db.all(sql, (err, cars) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(cars);
        });
    }
)};



//salva un nuovo veicolo
exports.addCar = function(brand, name, plateId){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO car("PLATE_ID", "name", "brand") VALUES (?, ?, ?);';

        db.run(sql, [plateId, name, brand], (err) => {
            if(err){
                resolve('Errore');
            } else{
                resolve();
            }
        });
    });
}

//salva un nuovo veicolo
exports.addModel = function(brand, name, seats, doors, transmission, description, cost, completeDescription){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO "main"."model" ("NAME", "BRAND", "n_posti", "n_porte", "trasmissione", "descrizione", "costo", "descrizioneCompleta") VALUES (?, ?, ?, ?, ?, ?, ?, ?);';

        db.run(sql, [name, brand, seats, doors, transmission, description, cost, completeDescription], (err) => {
            if(err){
                resolve('Errore');
            } else{
                resolve();
            }
        });
    });
}






