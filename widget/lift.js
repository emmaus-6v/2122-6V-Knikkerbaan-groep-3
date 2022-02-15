class Lift {
  state;

  constructor() {
    this.state = 0; // 0 = helemaal beneden, 500 = helemaal boven
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

  async omhoog(stepInterval) {
    return new Promise(resolve => {
      var state = this.state;
      var t = this;
      var interval = setInterval(function() {
        if(state < 500) {
          state++;
        } else {
          clearInterval(interval);
          resolve();
        }
        t.setState(state);
      }, stepInterval);
    })
  }

  async omlaag(stepInterval) {
    return new Promise(resolve => {
      var state = this.state;
      var t = this;
      var interval = setInterval(function() {
        if(state > 0) {
          state--;
        } else {
          clearInterval(interval);
          resolve();
        }
        t.setState(state);
      }, stepInterval);
    })
  }
}