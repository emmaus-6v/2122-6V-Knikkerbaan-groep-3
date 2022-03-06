#include <Servo.h>
#include <math.h>

class Lift {
  private:
    Servo servo;
    float liftSnelheid;
    
  public:
    Lift() {
      
    }

    void begin(int _pin) {
      servo.attach(_pin);
      servo.write(90);
    }

    void omhoog() {
      servo.write(90 + liftSnelheid);
    }

    void beneden() {
      servo.write(90 - liftSnelheid);
    }

    void stop() {
      servo.write(90);
    }

    void setSnelheid(int nieuweSnelheid) {
      // waarde komt in procenten, moet omgezet worden in waarde van 0 tot 40 (bij sneller dan 40 kan het touwtje kapot gaan)
      liftSnelheid = (float) nieuweSnelheid / 100 * 20;
    }
};
