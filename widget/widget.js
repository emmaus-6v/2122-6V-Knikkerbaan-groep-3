// globale variabelen
var aantalKnikkersBoven = 0;    // aantal knikkers dat bovenin is binnengekomen
var wachttijd = 15;             // wachttijd voor het poortje in seconden
const UPDATE_INTERVAL = 5000;   // tijd in milliseconden tussen het door widget opvragen van gegevens
var teller = new Teller(150, 50);
var poort = new Poort();
var lift = new Lift();
var huidigeRunId;
var instellingen = {};
var instellingenSliders = [
  new Slider(330, 50, 30, 100, 50, "#27d624", "Lift snelheid", "%", "snelheid_lift"),
  new Slider(330, 90, 2, 6, 3, "#fcba03", "Poort open tijd", "s", "poort_open_tijd"),
  new Slider(330, 130, 3, 10, 5, "#4187e0", "Tijd knikkers in lift", "s", "tijd_tot_knikkers_in_lift"),
  new Slider(330, 170, 3, 10, 5, "#b76385", "Tijd knikkers uit lift", "s", "tijd_tot_knikkers_uit_lift")
];


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
  Object.values(instellingenSliders).forEach(function(slider) {
    slider.mousePressed();
  });
}

function mouseReleased() {
  Object.values(instellingenSliders).forEach(function(slider) {
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

  teller.show();
  poort.show();
  lift.show();
  Object.values(instellingenSliders).forEach(function(slider) {
    slider.update();
    slider.show();
  });
}

// wat er gebeurt bij een nieuwe run
function nieuweRun() {
  poort.open(10).then(function() {
    setTimeout(function() {
      poort.dicht(10);
    }, 3000);
  });

  // sensor data opvragen
  var request = new XMLHttpRequest();

    // maak een http-verzoek
    request.open('GET', '/api/get/sensordata', true)
    request.onload = function () {
      var data = JSON.parse(request.response);
      if (request.status == 200) {
        console.log(data);
        // if(data.aantal_knikkers) {
        //   teller.aantal = data.aantal_knikkers;
        // } else {
        //   teller.aantal = null;
        // }
        // console.log(data);
      }
      else {
        console.log("server reageert niet zoals gehoopt");
        console.log(request.response);
      }
    }
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