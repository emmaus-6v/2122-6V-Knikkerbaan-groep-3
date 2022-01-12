/* Beschrijf de tabellen die je nodig hebt*/

CREATE TABLE runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stamp DATETIME NOT NULL
);

CREATE TABLE sensorData (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run INTEGER NOT NULL,
  stamp DATETIME NOT NULL,
  key TEXT NOT NULL,
  value INTEGER TEXT NOT NULL
);

CREATE TABLE instellingen (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run INTEGER NOT NULL,
  stamp DATETIME NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL
);


/* Indien je standaard wat gegevens in de database wilt,
   voeg hieronder dan INSERT regels to */
INSERT INTO runs (stamp) VALUES (CURRENT_TIMESTAMP);
INSERT INTO sensorData (run, stamp, key, value) VALUES (1, CURRENT_TIMESTAMP, 'aantal_knikkers', 3);
INSERT INTO instellingen (run, stamp, key, value) VALUES (1, CURRENT_TIMESTAMP, 'wachttijd_poort', 15);
