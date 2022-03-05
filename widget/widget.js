// globale variabelen
var aantalKnikkersBoven = 0;    // aantal knikkers dat bovenin is binnengekomen
var wachttijd = 15;             // wachttijd voor het poortje in seconden
const UPDATE_INTERVAL = 5000;   // tijd in milliseconden tussen het door widget opvragen van gegevens
var poort = new Poort();
var huidigeRunId;
var instellingen = {};
var instellingenSliders = [
  new Slider(330, 50, 30, 100, 50, "#27d624", "Lift snelheid", "%", "snelheid_lift"),
  new Slider(330, 90, 2, 6, 3, "#fcba03", "Poort open tijd", "s", "poort_open_tijd"),
  new Slider(330, 130, 3, 10, 5, "#4187e0", "Tijd knikkers in lift", "s", "tijd_tot_knikkers_in_lift"),
  new Slider(330, 170, 3, 10, 5, "#b76385", "Tijd knikkers uit lift", "s", "tijd_tot_knikkers_uit_lift")
];

var statistieken = {
  runId: new Statistiek("Huidige run", 200),
  totaalAantalKnikkers: new Statistiek("Totaal aantal\nknikkers", 300),
  vorigeRunAantalKnikkers: new Statistiek("Aantal knikkers\nvorige run", 400)
}

const tijdTotLiftOmhoogVolleSnelheid = 5000; // dit is een schatting, tijd die de lift erover doet om omhoog te komen op 100% snelheid
var lift = new Lift(tijdTotLiftOmhoogVolleSnelheid);

var runAnimatieTimeout; // om de animatie te kunnen stoppen bij een nieuwe run

/**
 * setup
 * de code in deze functie wordt eenmaal uitgevoerd,
 * als p5js wordt gestart
 */
function setup() {
  // Maak het canvas van je widget
  createCanvas(450, 600);

}

function mousePressed() {
  instellingenSliders.forEach(function(slider) {
    slider.mousePressed();
  });
}

function mouseReleased() {
  instellingenSliders.forEach(function(slider) {
    slider.mouseReleased();
  });
}

// Instellingen uit database halen en waardes goedzetten in widget
var request = new XMLHttpRequest();
request.open('GET', '/api/get/instellingen', true)

request.onload = function () {
  var data = JSON.parse(request.response);
  if (request.status == 200) {
      Object.keys(data).forEach(function(key) {
        var value = data[key];
        instellingenSliders.forEach(function(slider) {
          if(slider.instellingNaam == key) {
            slider.waarde = value;
          }
        })
      })
  }
  else {
    console.log("server reageert niet zoals gehoopt");
    console.log(request.response);
  }
}
request.send();


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
  fill("#000000");
  noStroke();
  rect(300, 0, 150, 600);

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

  poort.show();
  lift.show();
  instellingenSliders.forEach(function(slider) {
    slider.update();
    slider.show();
  });
  Object.values(statistieken).forEach(function(statistiek) {
    statistiek.show();
  });
}

// wat er gebeurt bij een nieuwe run
function nieuweRun() {
  resetRunAnimatie(); // als de widget denkt dat de vorige run nog bezig is, resetten en nieuwe animatie starten
  startRunAnimatie();

  // run ID updaten
  getHuidigeRunId().then(runId => {
    statistieken.runId.waarde = runId;
  });

  // sensor data opvragen
  var request = new XMLHttpRequest();
  // maak een http-verzoek
  request.open('GET', '/api/get/sensordata', true)
  request.onload = function () {
    var data = JSON.parse(request.response);
    if (request.status == 200) {
      statistieken.vorigeRunAantalKnikkers.waarde = data.aantal_knikkers | 0; // aantal aan statistiek doorgeven, als er geen aantal is op 0 zetten
      statistieken.totaalAantalKnikkers.waarde = data.totaal_aantal_knikkers | 0; // idem
      console.log(data);
    }
    else {
      console.log("server reageert niet zoals gehoopt");
      console.log(request.response);
    }
  }
  request.send();
}

// om de zoveel tijd checken of er al een nieuwe run bezig is
getHuidigeRunId().then(runId => {
  huidigeRunId = runId; // zorgen dat de trigger niet gelijk afgaat
setInterval(function() {
  getHuidigeRunId().then(runId => {
    if(runId != huidigeRunId) {
      nieuweRun();
      huidigeRunId = runId;
    }
  })
  .catch(function() {
    console.log("Eerste run nog niet bezig");
  });
}, 500);
})


function startRunAnimatie() {
  poort.open(10);
  var poortOpenTijd = instellingenSliders[1].waarde * 1000; // slider waarde "Poort open tijd", omgezet naar ms
  runAnimatieTimeout = setTimeout(function() {
    // poort dicht animatie na x aantal seconden
    poort.dicht(10);
    var tijdTotKnikkersInLift = instellingenSliders[2].waarde * 1000;
    runAnimatieTimeout = setTimeout(function() {
      lift.setSnelheid(instellingenSliders[0].waarde);
      lift.omhoog().then(function() {
        var tijdTotKnikkersUitLift = instellingenSliders[3].waarde * 1000;
        runAnimatieTimeout = setTimeout(function() {
          lift.omlaag();
        }, tijdTotKnikkersUitLift);
      });
    }, tijdTotKnikkersInLift);
  }, poortOpenTijd);
}

function resetRunAnimatie() {
  clearTimeout(runAnimatieTimeout);
  lift.reset();
}

async function getHuidigeRunId() {
  return new Promise((resolve, reject) => {
    var request = new XMLHttpRequest();
    request.open('GET', '/api/get/hoogsterunid', true)
    request.onload = function () {
      if (request.status == 200) {
        var runId = JSON.parse(request.response);
        resolve(runId);
      }
      else {
        reject();
      }
    }
    request.send();
  })
}