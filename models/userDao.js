'use strict';

const db = require('../db');
const bcrypt = require('bcrypt');

exports.getUserByEmail = function(user) {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM utente WHERE EMAIL = ?';
      db.get(sql, [user.username], (err, row) => {
          if (err)
              reject(err);
          else if (row === undefined)
              resolve({error: 'User not found.'});
          else {
              //const user = {username: row.EMAIL}
              resolve(row);
          }
      });
  });
};

exports.getUser = function(email, password) {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM utente WHERE EMAIL = ?';
      db.get(sql, [email], (err, row) => {
          if (err) 
              reject(err);
          else if (row === undefined)
              resolve({error: 'User not found.'});
          else {
            const user = {username: email, type: 'user'};
            let check = false;
            
            if(bcrypt.compareSync(password, row.password))
              check = true;

            resolve({user, check});
          }
      });
  });
};

exports.registerUser = function(nome, cognome, email, data, password){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO utente ("EMAIL", "nome", "cognome", "data_nascita", "password") VALUES (?, ?, ?, ?, ?);'
        const hashedPassword = bcrypt.hashSync(password, 10);
        db.run(sql, [email, nome, cognome, data, hashedPassword], (err) => {
            if (err){
                /*if (err.message.includes('UNIQUE constraint failed: utente.EMAIL')){
                    reject({error: 'Email already registered'});
                }*/
                reject(err);
            }
                
            else
                resolve();
        });
    });
};



exports.getEmployee = function(id, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM dipendente WHERE ID = ?';
        db.get(sql, [id], (err, row) => {
            if (err) 
                reject(err);
            else if (row === undefined)
                resolve({error: 'User not found.'});
            else {
              const user = {username: id, type: 'employee'};
              let check = false;
              
              if(bcrypt.compareSync(password, row.Password))
                check = true;
  
              resolve({user, check});
            }
        });
    });
  };


  exports.getAllUsers = function() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM utente';
        db.all(sql, (err, users) => {
            if (err) 
                reject(err);
            else if (users === undefined)
                resolve({error: 'Nessun utente trovato'});
            else {
              
              resolve(users);
            }
        });
    });
  };