class Slider {
  x;
  y;
  minimaleWaarde;
  maximaleWaarde;
  waarde;
  kleur;
  circleX = 0;
  sliderHold = false;

  constructor(_x, _y, _minimaleWaarde, _maximaleWaarde, _standaardWaarde, _kleur) {
    this.x = _x;
    this.y = _y;
    this.minimaleWaarde = _minimaleWaarde;
    this.maximaleWaarde = _maximaleWaarde;
    this.waarde = _standaardWaarde;
    this.kleur = _kleur;
  }

  update() {
    this.circleX = ((this.waarde - this.minimaleWaarde) * 100 / (this.maximaleWaarde - this.minimaleWaarde)) + this.x;

    if(this.sliderHold) {
      // als de slider wordt verplaatst de juiste X waarde geven
      if(mouseX > this.x + 100) {
        // zorgen dat de slider niet buiten de rand gaat
        this.circleX = this.x + 100;
      } else if(mouseX < this.x) {
        // idem
        this.circleX = this.x;
      } else {
        this.circleX = mouseX;
      }
    }
  }

  show() {
    // lijn tekenen
    strokeWeight(5);
    stroke(this.kleur);
    line(this.x, this.y, this.x + 100, this.y);
    // cirkeltje tekenen
    fill("#000000");
    noStroke();
    circle(this.circleX, this.y, 13);
  }

  mousePressed() {
    var circleXLinks = this.circleX - 6.5;
    var circleXRechts = this.circleX + 6.5;
    var circleYBoven = this.y - 6.5;
    var circleYOnder = this.y + 6.5;
    if(mouseX > circleXLinks && mouseX < circleXRechts && mouseY > circleYBoven && mouseY < circleYOnder) {
      this.sliderHold = true;
    }
  }

  mouseReleased() {
    if(mouseX > this.x + 100) {
      this.waarde = this.maximaleWaarde;
    } else if(mouseX < this.x) {
      this.waarde = this.minimaleWaarde;
    } else {
      var val = (mouseX - this.x) / 100; // kommagetal van 0 tot 1, 0 = helemaal links, 1 = helemaal rechts
      this.waarde = this.minimaleWaarde + ((this.maximaleWaarde - this.minimaleWaarde) * val);
    }
    this.sliderHold = false;
  }

}