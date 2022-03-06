#include <Arduino_JSON.h>
#include <HCSR04.h>

KnikkerPoort poortBoven = KnikkerPoort();
WiFiCommunicator wifi = WiFiCommunicator(WIFI_NETWERK, WIFI_WACHTWOORD, SERVER_DOMEINNAAM);
Lift lift = Lift();
LedStrip ledStrip = LedStrip();

unsigned long tijdVoorVolgendeFase = 0;

// instellingen die opgevraagd worden op de server:
int poortOpenTijd;
int tijdTotKnikkersInLift;
int tijdTotKnikkersUitLift;
int ledsHelderheid;

int totaalAantalKnikkers = 0;

int fase = 0;
// fases:
// 0 = poort open
// 1 = poort dicht, knikkers naar lift
// 2 = lift omhoog aan het gaan
// 3 = lift is boven, knikkers zijn eruit aan het stromen
// 4 = lift naar beneden aan het gaan
// 5 = requests naar server maken
// fase 0, 1 en 3 hebben een vaste tijd (in te stellen in de widget), de rest van de fases zijn klaar zodra een sensor dit aangeeft

Teller tellerA = Teller(TELLER_A_PIN);
UltraSonicDistanceSensor afstandsSensor(3, 4);

void setup() {
  Serial.begin(9600);

  poortBoven.begin(BOVEN_POORT_PIN, 40, 0);
  lift.begin(LIFT_SERVO_PIN);
  ledStrip.begin();
  
  wifi.begin();
  
  updateInstellingen();

  ledStrip.rainbow(); // eerste rainbow frame laten zien

  // eerste run starten
  wifi.stuurVerzoek("/api/set/nieuweRun", "");

  tijdVoorVolgendeFase = millis() + poortOpenTijd;

}


void loop() {
  float liftAfstand = afstandsSensor.measureDistanceCm();

  if(fase == 0) {
    poortBoven.open();
    tellerA.update(); // knikkers tellen gebeurt alleen in fase 1 en 2
    if(millis() > tijdVoorVolgendeFase) {
      fase++; // naar volgende fase
      tijdVoorVolgendeFase = millis() + tijdTotKnikkersInLift; // fase 1 duur
    }
  }

  if(fase == 1) {
    poortBoven.sluit();
    tellerA.update(); // knikkers tellen gebeurt alleen in fase 1 en 2
    if(millis() > tijdVoorVolgendeFase) {
      fase++; // naar volgende fase
    }
  }

  if(fase == 2) { // lift is omhoog aan het gaan
    if(liftAfstand < LIFT_AFSTAND_BOVEN) {
      // als de lift nog omhoog aan het gaan is
      lift.omhoog();  
    } else {
      // als de lift boven is
      lift.stop();
      fase++;
      tijdVoorVolgendeFase = millis() + tijdTotKnikkersUitLift; // fase 3 duur
    }
  }

  if(fase == 3) { // knikkers stromen uit lift
    ledStrip.rainbow();
    if(millis() > tijdVoorVolgendeFase) {
      fase++; // naar volgende fase
    }
  }

  if(fase == 4) { // lift is naar beneden aan het gaan
    if(liftAfstand > LIFT_AFSTAND_BENEDEN) {
      // als de lift nog naar beneden aan het gaan is
      lift.beneden();
    } else {
      // als de lift beneden is
      lift.stop();
      fase++;
    }
  }

  if(fase == 5) { // requests maken
    updateInstellingen(); // nieuwe instellingen van server halen

    // aantal knikkers deze run doorsturen
    String queryString = "aantal_knikkers=";
    queryString.concat(tellerA.getAantal());
    wifi.stuurVerzoek("/api/set/sensorData", queryString);

    // totaal aantal knikkers doorsturen
    totaalAantalKnikkers += tellerA.getAantal();
    String queryString2 = "totaal_aantal_knikkers=";
    queryString2.concat(totaalAantalKnikkers);
    wifi.stuurVerzoek("/api/set/sensorData", queryString2);

    // nieuwe run aanmaken
    wifi.stuurVerzoek("/api/set/nieuweRun", "");

    // teller resetten
    tellerA.reset();

    // knikkerbaan opnieuw starten
    fase = 0; // weer bij fase 0 beginnen
    tijdVoorVolgendeFase = millis() + poortOpenTijd;
  }
  
}

void updateInstellingen() {
  String instellingenStr = wifi.stuurVerzoek("/api/get/instellingen", "");
  JSONVar instellingen = JSON.parse(instellingenStr);
  if (JSON.typeof(instellingen) == "undefined") {
    Serial.println("Input failed");
  }
  lift.setSnelheid((int) instellingen["snelheid_lift"]);
  ledStrip.setHelderheid((int) instellingen["leds_helderheid"]);
  poortOpenTijd = (int) instellingen["poort_open_tijd"] * 1000; // waarde wordt doorgegeven in s, dus x1000
  tijdTotKnikkersInLift = (int) instellingen["tijd_tot_knikkers_in_lift"] * 1000; // idem
  tijdTotKnikkersUitLift = (int) instellingen["tijd_tot_knikkers_uit_lift"] * 1000; // idem
}
