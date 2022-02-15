
// globale variabelen
var aantalKnikkersBoven = 0;    // aantal knikkers dat bovenin is binnengekomen
var wachttijd = 15;             // wachttijd voor het poortje in seconden
const UPDATE_INTERVAL = 5000;   // tijd in milliseconden tussen het door widget opvragen van gegevens
var button;
var teller;
var wachtijdInput;
var poort;
var lift;
var huidigeRunId;

/**
 * setup
 * de code in deze functie wordt eenmaal uitgevoerd,
 * als p5js wordt gestart
 */
function setup() {
  // Maak het canvas van je widget
  createCanvas(300, 600);

  teller = new Teller(150, 50);
  poort = new Poort();
  lift = new Lift();

  var balletjes = ["f"];
  bal = new Balletje();
  // bal.checkCollide(balletjes);
  

  // om de ... milliseconden wordt 'vraagSensorData' uitgevoerd
  setInterval(vraagSensorData, UPDATE_INTERVAL);
}


/**
 * draw
 * de code in deze functie wordt meerdere keren per seconde
 * uitgevoerd door de p5 library, nadat de setup functie klaar is
 */
function draw() {
  // schrijf hieronder de code van je widget
  // hieronder wordt schematisch een knikkerbaan getekend

  // achtergrond: houtkleur, kies gerust iets anders
  background(175, 144, 105);

  stroke(0, 0, 0);
  strokeWeight(6);
  // Opvangbak bovenaan
  line(80, 30, 230, 50);

  line(280, 15, 280, 60);
  line(280, 60, 260, 75);

  // Opvangbak vrije val
  line(230, 430, 105, 445);

  line(105, 445, 105, 480);
  
  line(105, 480, 80, 480);
  
  
  line(80, 445, 80, 480);

  teller.show();
  poort.show();
  lift.show();
  bal.show();
}

// wat er gebeurt bij een nieuwe run
function nieuweRun() {
  poort.open(10).then(function() {
    setTimeout(function() {
      poort.dicht(10);
    }, 2000);
  });
}


// stuurt een verzoek aan de server dat alle
// sensordata opvraagt
function vraagSensorData() {
  var request = new XMLHttpRequest();

  // maak een http-verzoek
  request.open('GET', '/api/get/sensordata', true)

  // wat uitvoeren als het antwoord teruggegeven wordt?
  request.onload = function () {
    var data = JSON.parse(request.response);

    if (request.status == 200) {
      if(data.aantal_knikkers) {
        teller.aantal = data.aantal_knikkers;
      } else {
        teller.aantal = null;
      }
      console.log(data);
    }
    else {
      console.log("server reageert niet zoals gehoopt");
      console.log(request.response);
    }
  }

  // verstuur het request
  request.send();
}


// om de zoveel tijd checken of er al een nieuwe run bezig is
setInterval(function() {
  var request = new XMLHttpRequest();
  request.open('GET', '/api/get/hoogsterunid', true)
  
  request.onload = function () {
    var runId = JSON.parse(request.response);
    if (request.status == 200) {
        if(runId != huidigeRunId) {
          nieuweRun();
          huidigeRunId = runId;
        }
    }
    else {
      console.log("server reageert niet zoals gehoopt");
      console.log(request.response);
    }
  }
  request.send();

}, 500);


// stuurt een http-verzoek aan de server met de
// nieuwe instellingen
function stuurNieuweInstellingen() {
  // moet nog worden gemaakt
}