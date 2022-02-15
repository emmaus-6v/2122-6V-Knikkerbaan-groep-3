class Poort {
  state;
  isOpen;

  constructor() {
    this.state = 0; // 0 = helemaal dicht, 100 = helemaal open
    this.isOpen = false;
  }

  show() {
    push();
      noStroke();
      fill(255, 255, 255);
      stroke(0, 0, 0);
      strokeWeight(6);
      translate(230,10);
      rotate(-PI / 2 / 100 * this.state);
      translate(-230,-10);
      line(230,10, 230, 40);
    pop();
  }

  setState(state) {
    this.state = state;
  }
  setOpen(open) {
    this.isOpen = open;
  }

  async open(stepInterval) {
    return new Promise(resolve => {
      var state = this.state;
      var t = this;
      var interval = setInterval(function() {
        if(state < 100) {
          state++;
        } else {
          t.setOpen(false);
          clearInterval(interval);
          resolve();
        }
        t.setState(state);
      }, stepInterval);
    })
  }

  async dicht(stepInterval) {
    return new Promise(resolve => {
      var state = this.state;
      var t = this;
      var interval = setInterval(function() {
        if(state > 0) {
          state--;
        } else {
          t.setOpen(true);
          clearInterval(interval);
          resolve();
        }
        t.setState(state);
      }, stepInterval);
    })
  }

  
}