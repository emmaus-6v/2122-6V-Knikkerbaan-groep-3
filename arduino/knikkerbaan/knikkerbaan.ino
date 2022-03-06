// wifi
char WIFI_NETWERK[] = "";
char WIFI_WACHTWOORD[] = "";
char SERVER_DOMEINNAAM[] = "3000-emmaus6v-21226vknikkerba-ppo2md968qk.ws-eu34.gitpod.io";    // domeinnaam van gitpod-server, zoals 3000-lavendel-bla-bla.gitpod.io

// pins
const int BOVEN_POORT_PIN = 2;    // pin van servo die bovenste poort regelt
const int TELLER_A_PIN = 5;       // pin waarop IR-sensor voor Teller A is aangesloten
const int LIFT_SERVO_PIN = 7;
const int LED_STRIP_PIN = 9;

// fysieke eigenschappen knikkerbaan
const float LIFT_AFSTAND_BENEDEN = 10; // wat de afstandssensor aangeeft als de lift beneden is (cm)
const float LIFT_AFSTAND_BOVEN = 20; // wat de afstandssensor aangeeft als de lift boven is (cm)
const int AANTAL_LEDS = 8;
