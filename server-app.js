const express = require('express');
const http = require('http');
const Database = require('better-sqlite3');
const path = require('path');
const app = express();
const port = 3000;

// een paar instellingen voor de server
var db = new Database('./database/database.db', { verbose: console.log });
app.use(express.static(path.join(__dirname, '/widget')));


// definieer startpunten voor de server
app.get('/', geefWidget);
app.get('/api/echo', echoRequest);
app.get('/api/set/nieuwerun', creeerNieuweRun);
app.get('/api/set/sensordata', setSensorData);
app.get('/api/get/sensordata', getSensorData);
app.get('/api/set/instellingen', setInstellingen);
app.get('/api/get/instellingen', getInstellingen);
app.get('/api/get/hoogsterunid', hoogsteRunId);

// start de server
app.listen(port, serverIsGestart);

// ---------------------------------------------------------------------------

// wordt uitgevoerd als de server is opgestart
function serverIsGestart() {
  var url = process.env.GITPOD_WORKSPACE_URL;
  console.log(`De server is opgestart en is bereikbaar op ${url}:${port}`);
}


// stuurt het html-bestand van de widget
function geefWidget(request, response) {
  response.redirect('index.html');
}


// stuurt de variabelen uit het request
// terug naar de browser en in de console
function echoRequest(request, response) {
  response.status(200).send(request.query);
}


// maakt een nieuwe run aan in de database
// en geeft een oké terug
function creeerNieuweRun(request, response) {
  // insert een nieuwe regel in de tabel 'runs'
  // waarin we alleen de huidige tijd (timestamp) meegeven
  db.prepare("INSERT INTO runs (stamp) VALUES (CURRENT_TIMESTAMP)").run();
  response.status(200).send();
}


// geeft laatste sensordata van de run terug 
function getSensorData(request, response) {
  var huidigeRunID = geefHoogsteRunID();
  var stmt = db.prepare('SELECT key,value FROM sensorData WHERE run = ? ORDER BY stamp DESC');
  var data = stmt.all(huidigeRunID);
  // sensor data naar een leesbaar object converten, formaat:
  // {key: value, key: value, etc..}
  var dataLeesbaar = {};
  data.forEach(function(obj) {
    dataLeesbaar[obj.key] = obj.value;
  })
  response.status(200).send(dataLeesbaar);
}


// slaat doorgegeven data op in de database
function setSensorData(request, response) {
  var key = Object.keys(request.query)[0];
  var value = request.query[key];
  var huidigeRunID = geefHoogsteRunID();
  var SQL = `INSERT INTO sensorData (run, stamp, key, value)
             VALUES (?, CURRENT_TIMESTAMP, ?, ?)`;
  db.prepare(SQL).run(huidigeRunID, key, value);
  response.status(200).send();
}

function hoogsteRunId(request, response) {
  var runId = geefHoogsteRunID().toString();
  response.status(200).send(runId);
}


// geeft de laatst ingevoerde instellingen terug
function getInstellingen(request, response) {
  var stmt = db.prepare('SELECT key,value FROM instellingen');
  var data = stmt.all();
  // sensor data naar een leesbaar object converten, formaat:
  // {key: value, key: value, etc..}
  var dataLeesbaar = {};
  data.forEach(function(obj) {
    dataLeesbaar[obj.key] = obj.value;
  })
  response.status(200).send(dataLeesbaar);
}


// slaat doorgegeven instellingen op in de database
function setInstellingen(request, response) {
  var key = Object.keys(request.query)[0];
  var value = request.query[key];
  var SQL = `INSERT OR REPLACE INTO instellingen (key, value) VALUES (?, ?);`; // insert or replace zodat er geen dubbele instellingen in komen
  db.prepare(SQL).run(key, value);
  response.status(200).send();
}


// geeft de hoogste id uit de runs tabel
// dit is een hulpfunctie voor gebruik in andere queries
function geefHoogsteRunID() {
  var data = db.prepare("SELECT max(id) as id FROM runs").get();
  return data.id;
}