BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "utente" (
	"EMAIL"	TEXT UNIQUE,
	"nome"	TEXT,
	"cognome"	TEXT,
	"data_nascita"	TEXT,
	"password"	TEXT,
	PRIMARY KEY("EMAIL")
);
CREATE TABLE IF NOT EXISTS "car" (
	"PLATE_ID"	TEXT NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"brand"	TEXT NOT NULL,
	"km_traveled"	INTEGER NOT NULL,
	FOREIGN KEY("name","brand") REFERENCES "model"("NAME","BRAND"),
	PRIMARY KEY("PLATE_ID")
);
CREATE TABLE IF NOT EXISTS "model" (
	"NAME"	TEXT NOT NULL,
	"BRAND"	TEXT NOT NULL,
	"n_posti"	INTEGER NOT NULL,
	"n_porte"	INTEGER NOT NULL,
	"trasmissione"	TEXT NOT NULL,
	"descrizione"	TEXT NOT NULL,
	"costo"	INTEGER,
	PRIMARY KEY("NAME","BRAND")
);
CREATE TABLE IF NOT EXISTS "dipendente" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"Nome"	TEXT NOT NULL,
	"Cognome"	TEXT NOT NULL,
	"Password"	TEXT NOT NULL,
	PRIMARY KEY("ID" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "optional_cost" (
	"NAME"	TEXT NOT NULL,
	"cost"	INTEGER NOT NULL,
	PRIMARY KEY("NAME")
);
CREATE TABLE IF NOT EXISTS "optional" (
	"brand"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"optional"	TEXT NOT NULL,
	FOREIGN KEY("optional") REFERENCES "optional_cost"("name"),
	FOREIGN KEY("brand","name") REFERENCES "model"("brand","name"),
	PRIMARY KEY("brand","name","optional")
);
CREATE TABLE IF NOT EXISTS "affitti" (
	"AUTO"	TEXT NOT NULL,
	"UTENTE"	TEXT NOT NULL,
	"data_inizio"	TEXT NOT NULL,
	"data_fine"	INTEGER NOT NULL,
	"costo"	INTEGER NOT NULL,
	"Portapacchi"	TEXT,
	"Portabici"	TEXT,
	"Seggiolino"	TEXT,
	"Catene"	TEXT,
	"Cinghie"	TEXT,
	"Alimentatore"	TEXT,
	"Navigatore"	TEXT,
	FOREIGN KEY("AUTO") REFERENCES "car"("PLATE_ID"),
	PRIMARY KEY("AUTO","UTENTE","data_inizio")
);
INSERT INTO "utente" VALUES ('leogall2002@gmail.com','Leonardo','Galliera','06/02/2002','$2b$10$3NDSeI4cQpC8FaMFHjfkJeOFTGncDQnaY4ZG0D04Ssihjf/u.x1kS');
INSERT INTO "car" VALUES ('AB123CD','Panda','FIAT',0);
INSERT INTO "car" VALUES ('FF001GG','Panda','FIAT',7500);
INSERT INTO "car" VALUES ('FG761GK','Giulia','ALFA ROMEO',23000);
INSERT INTO "car" VALUES ('AA000AA','Transit','FORD',12870);
INSERT INTO "car" VALUES ('BB111BB','Tipo','FIAT',1200);
INSERT INTO "car" VALUES ('CI999AO','R8','AUDI',7300);
INSERT INTO "model" VALUES ('Panda','FIAT',5,5,'M','Compatta, economica e perfetta per gli spostamenti in citta',35);
INSERT INTO "model" VALUES ('Giulia','ALFA ROMEO',4,3,'S','Prestazioni, comodità e perfetta per percorrere lunghe distanze',55);
INSERT INTO "model" VALUES ('Transit','FORD',3,3,'M','Capiente, versatile e perfetto se quello che serve è capacità di carico',60);
INSERT INTO "model" VALUES ('Tipo','FIAT',5,5,'M','qwertyui',47);
INSERT INTO "model" VALUES ('R8','AUDI',2,2,'S','Brividi',80);
INSERT INTO "dipendente" VALUES (1111,'Leonardo','Galliera','$2a$12$IKXLS1JHqNRGIu4vdY3uoOdfqqnVaX9K45BHTO..RSbEGwUmPq97y');
INSERT INTO "optional_cost" VALUES ('Portapacchi',10);
INSERT INTO "optional_cost" VALUES ('Portabici',7);
INSERT INTO "optional_cost" VALUES ('Seggiolino per bambini',8);
INSERT INTO "optional_cost" VALUES ('Catene da neve',6);
INSERT INTO "optional_cost" VALUES ('Cinghie di carico aggiuntive',5);
INSERT INTO "optional_cost" VALUES ('Alimentatore telefono',3);
INSERT INTO "optional_cost" VALUES ('Navigatore',10);
INSERT INTO "optional" VALUES ('FIAT','Panda','Portapacchi');
INSERT INTO "optional" VALUES ('FIAT','Panda','Seggiolino per bambini');
INSERT INTO "optional" VALUES ('FIAT','Panda','Catene da neve');
INSERT INTO "optional" VALUES ('ALFA ROMEO','Giulia','Seggiolino per bambini');
INSERT INTO "optional" VALUES ('FORD','Transit','Cinghie di carico aggiuntive');
INSERT INTO "optional" VALUES ('ALFA ROMEO','Giulia','Catene da neve');
INSERT INTO "optional" VALUES ('FORD','Transit','Portabici');
INSERT INTO "optional" VALUES ('FIAT','Tipo','Seggiolino per bambini');
INSERT INTO "optional" VALUES ('FIAT','Tipo','Catene da neve');
INSERT INTO "optional" VALUES ('FIAT','Tipo','Portapacchi');
INSERT INTO "optional" VALUES ('FIAT','Tipo','Portabici');
INSERT INTO "optional" VALUES ('FIAT','Panda','Portabici');
INSERT INTO "optional" VALUES ('AUDI','R8','Seggiolino per bambini');
INSERT INTO "optional" VALUES ('FIAT','Panda','Alimentatore telefono');
INSERT INTO "optional" VALUES ('FIAT','Tipo','Alimentatore telefono');
INSERT INTO "optional" VALUES ('AUDI','R8','Alimentatore telefono');
INSERT INTO "optional" VALUES ('FORD','Transit','Alimentatore telefono');
INSERT INTO "optional" VALUES ('ALFA ROMEO','Giulia','Alimentatore telefono');
INSERT INTO "optional" VALUES ('FIAT','Panda','Navigatore');
INSERT INTO "optional" VALUES ('FIAT','Tipo','Navigatore');
INSERT INTO "optional" VALUES ('AUDI','R8','Navigatore');
INSERT INTO "optional" VALUES ('FORD','Transit','Navigatore');
INSERT INTO "optional" VALUES ('ALFA ROMEO','Giulia','Navigatore');
INSERT INTO "affitti" VALUES ('AB123CD','leogall2002@gmail.com','2023-06-16','2023-06-17',35,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO "affitti" VALUES ('AB123CD','leogall2002@gmail.com','2023-06-17','2023-06-18',35,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
COMMIT;
