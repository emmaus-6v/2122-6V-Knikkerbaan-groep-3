class Slider {
  circleX = 0;
  sliderHold = false;

  constructor(_x, _y, _minimaleWaarde, _maximaleWaarde, _standaardWaarde, _kleur, _naam, _suffix, _instellingNaam) {
    this.x = _x;
    this.y = _y;
    this.minimaleWaarde = _minimaleWaarde;
    this.maximaleWaarde = _maximaleWaarde;
    this.waarde = _standaardWaarde;
    this.kleur = _kleur;
    this.naam = _naam;
    this.suffix = _suffix;
    this.instellingNaam = _instellingNaam;
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
    // tekst tekenen
    push();
      textSize(10);
      fill("#ffffff");
      text(this.naam + ":", this.x - 6, this.y - 12);
      textAlign(RIGHT);
      text(Math.round(this.waarde).toString() + this.suffix, this.x + 100, this.y - 12);
    pop();
    // lijn tekenen
    strokeWeight(5);
    stroke("#ffffff");
    line(this.x, this.y, this.x + 100, this.y);
    // cirkeltje tekenen
    fill(this.kleur);
    noStroke();
    circle(this.circleX, this.y, 13);
  }

  mousePressed() {
    var sliderXLinks = this.x - 10;
    var sliderXRechts = this.x + 110;
    var circleYBoven = this.y - 6.5;
    var circleYOnder = this.y + 6.5;
    if(mouseX > sliderXLinks && mouseX < sliderXRechts && mouseY > circleYBoven && mouseY < circleYOnder) {
      this.sliderHold = true;
    }
  }

  mouseReleased() {
    if(this.sliderHold) {
      if(mouseX > this.x + 100) {
        this.waarde = this.maximaleWaarde;
      } else if(mouseX < this.x) {
        this.waarde = this.minimaleWaarde;
      } else {
        var val = (mouseX - this.x) / 100; // kommagetal van 0 tot 1, 0 = helemaal links, 1 = helemaal rechts
        this.waarde = this.minimaleWaarde + ((this.maximaleWaarde - this.minimaleWaarde) * val);
      }
      this.sliderHold = false;
      this.updateInstelling();
    }
  }

  updateInstelling() {
    var obj = {};
    obj[this.instellingNaam] = Math.round(this.waarde);
    var parameters = new URLSearchParams(obj).toString();
    var request = new XMLHttpRequest();
    request.open('GET', '/api/set/instellingen?' + parameters, true)
    request.send();
  }

}