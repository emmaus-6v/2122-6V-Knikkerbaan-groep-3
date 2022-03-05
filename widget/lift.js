class Lift {
  state;
  snelheid; // waarde tussen 0 en 100
  tijdTotOmhoogVolleSnelheid;
  interval;

  constructor(_tijdTotOmhoogVolleSnelheid) {
    this.state = 0; // 0 = helemaal beneden, 500 = helemaal boven
    this.tijdTotOmhoogVolleSnelheid = _tijdTotOmhoogVolleSnelheid;
  }

  show() {
    const hoogteLift = 350;
    // lift outline
    push();
      stroke(51);
      strokeWeight(4);
      noFill();
      rect(80,110,130,400);
    pop();
    // lift 'houtje' (waar de knikkers op liggen)
    push();
      strokeWeight(3);
      stroke(0, 0, 0);
      var offset = hoogteLift / 500 * this.state;
      line(85,475 - offset, 205,502 - offset);
    pop();
  }

  setState(state) {
    this.state = state;
  }

  setSnelheid(snelheid) {
    this.snelheid = snelheid;
  }

  reset() {
    clearInterval(this.interval);
    this.state = 0;
  }

  async omhoog() {
    return new Promise(resolve => {
      var tijdTotOmhoog = this.tijdTotOmhoogVolleSnelheid / (this.snelheid / 100);
      var interval = tijdTotOmhoog / 500;
      var state = this.state;
      var t = this;
      this.interval = setInterval(function() {
        if(state < 500) {
          state++;
        } else {
          clearInterval(t.interval);
          resolve();
        }
        t.setState(state);
      }, interval);
    })
  }

  async omlaag() {
    return new Promise(resolve => {
      var tijdTotOmhoog = this.tijdTotOmhoogVolleSnelheid / (this.snelheid / 100);
      var interval = tijdTotOmhoog / 500;
      var state = this.state;
      var t = this;
      this.interval = setInterval(function() {
        if(state > 0) {
          state--;
        } else {
          clearInterval(t.interval);
          resolve();
        }
        t.setState(state);
      }, interval);
    })
  }
}